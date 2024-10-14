import { LargeCard } from "@/components/large-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Documents() {
  return (
    <div>
      <LargeCard>
        <h1 className="text-center text-2xl">File Preview</h1>
        <br />
        <Card className="w-full max-w-xl mx-auto overflow-hidden">
          <div>
            <iframe
              src="https://docs.google.com/document/d/1NEyy8BH4pikb2sSFcYxOBc3Rq5hpCMF4-eSlHxC0zaM/preview"
              width="640"
              height="480"
            />
          </div>
        </Card>
        <br />
        <div className="flex justify-center">
          <Link to="https://drive.google.com/drive/u/0/folders/1MlN8a2u090iAOHGups9p9ZYW7C0yvEPI">
            <Button>Google Drive</Button>
          </Link>
        </div>
      </LargeCard>
    </div>
  );
}
