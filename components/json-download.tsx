type JsonDownloadProps = {
  data?: Record<string, unknown>;
  fileName?: string;
  trigger: React.ReactNode;
  beforeEvent?: () => Promise<Record<string, unknown> | undefined>;
  disabled?: boolean;
};

export const JsonDownload: React.FC<JsonDownloadProps> = ({
  data,
  fileName = "data.json",
  trigger,
  beforeEvent,
  disabled,
}) => {
  const handleDownload = async () => {
    if (disabled) return;

    let finalData = data;

    if (beforeEvent) {
      finalData = await beforeEvent();
    }

    if (!finalData) return;

    const jsonStr = JSON.stringify(finalData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div
      onClick={handleDownload}
      style={{ display: "inline-block", cursor: "pointer" }}
    >
      {trigger}
    </div>
  );
};
