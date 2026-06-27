import osc from "osc";

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
  private readonly port: osc.UDPPort;
  private isOpen = false;

  constructor(private readonly config: ResolumeConfig) {
    this.port = new osc.UDPPort({
      localAddress: config.localAddress ?? "0.0.0.0",
      localPort: config.localPort ?? 0,
      remoteAddress: config.ip,
      remotePort: config.port
    });
  }

  async connect(): Promise<void> {
    if (this.isOpen) {
      return;
    }

    await new Promise<void>((resolve) => {
      this.port.once("ready", () => {
        this.isOpen = true;
        resolve();
      });
      this.port.open();
    });
  }

  close(): void {
    if (!this.isOpen) {
      return;
    }

    this.port.close();
    this.isOpen = false;
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
    await this.connect();
    this.port.send({ address, args });
  }
}
