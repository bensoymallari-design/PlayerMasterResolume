import dgram from "node:dgram";

export interface ResolumeConfig {
  ip: string;
  port: number;
  localAddress?: string;
  localPort?: number;
}

export interface OscArgument {
  type: "i" | "f" | "s" | "T" | "F";
  value?: number | string | boolean;
}

export class ResolumeService {
  private readonly socket: dgram.Socket;

  constructor(private readonly config: ResolumeConfig) {
    this.socket = dgram.createSocket("udp4");
    if (config.localPort || config.localAddress) {
      this.socket.bind(config.localPort ?? 0, config.localAddress ?? "0.0.0.0");
    }
  }

  close(): void {
    this.socket.close();
  }

  async triggerClip(layer: number, clip: number): Promise<void> {
    await this.send(`/composition/layers/${layer}/clips/${clip}/connect`, [
      { type: "i", value: 1 }
    ]);
  }

  async triggerColumn(column: number): Promise<void> {
    await this.send(`/composition/columns/${column}/connect`, [{ type: "i", value: 1 }]);
  }

  async clearLayer(layer: number): Promise<void> {
    await this.send(`/composition/layers/${layer}/clear`, [{ type: "i", value: 1 }]);
  }

  async setOpacity(layer: number, opacity: number): Promise<void> {
    const normalized = Math.max(0, Math.min(1, opacity));
    await this.send(`/composition/layers/${layer}/video/opacity`, [
      { type: "f", value: normalized }
    ]);
  }

  async setLayerVisibility(layer: number, visible: boolean): Promise<void> {
    await this.send(`/composition/layers/${layer}/bypassed`, [
      { type: "i", value: visible ? 0 : 1 }
    ]);
  }

  async updateTextLayer(layer: number, clip: number, text: string): Promise<void> {
    await this.send(`/composition/layers/${layer}/clips/${clip}/video/source/blocktextgenerator/text/params/lines`, [
      { type: "s", value: text }
    ]);
  }

  private async send(address: string, args: OscArgument[]): Promise<void> {
    const message = encodeOscMessage(address, args);
    await new Promise<void>((resolve, reject) => {
      this.socket.send(message, this.config.port, this.config.ip, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
}

function encodeOscMessage(address: string, args: OscArgument[]): Buffer {
  const typeTag = `,${args.map((arg) => arg.type).join("")}`;
  return Buffer.concat([
    oscString(address),
    oscString(typeTag),
    ...args.map((arg) => encodeArg(arg))
  ]);
}

function oscString(value: string): Buffer {
  const raw = Buffer.from(`${value}\0`, "utf8");
  return Buffer.concat([raw, Buffer.alloc(padding(raw.length))]);
}

function encodeArg(arg: OscArgument): Buffer {
  if (arg.type === "i") {
    const buffer = Buffer.alloc(4);
    buffer.writeInt32BE(Number(arg.value ?? 0));
    return buffer;
  }

  if (arg.type === "f") {
    const buffer = Buffer.alloc(4);
    buffer.writeFloatBE(Number(arg.value ?? 0));
    return buffer;
  }

  if (arg.type === "s") {
    return oscString(String(arg.value ?? ""));
  }

  return Buffer.alloc(0);
}

function padding(length: number): number {
  return (4 - (length % 4)) % 4;
}
