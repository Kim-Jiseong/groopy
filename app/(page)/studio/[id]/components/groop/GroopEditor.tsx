import Typography from "@/components/common/Typography";
import React, { useState } from "react";

function GroopEditor({ crewInfo }: { crewInfo: any }) {
  const [crewData, setCrewData] = useState(crewInfo);
  return (
    <div className="flex flex-col mx-auto w-full p-4">
      <Typography variant="subtitle1" className="mb-4">
        Groop Setting
      </Typography>
      <div className="flex flex-col gap-3"></div>
    </div>
  );
}

export default GroopEditor;
