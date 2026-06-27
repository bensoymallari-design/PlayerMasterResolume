import { FeaturePage } from "@/components/feature-page";

export default function ResolumePage(): React.ReactElement {
  return (
    <FeaturePage
      title="Resolume Integration"
      description="Configure OSC connectivity and trigger Resolume composition actions from reusable TypeScript service classes."
      features={[
        "Resolume IP and port configuration",
        "Trigger clip and trigger column",
        "Clear layer",
        "Set opacity and layer visibility",
        "Update text layers",
        "Shared @playermaster/resolume package"
      ]}
    />
  );
}
