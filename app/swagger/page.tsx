

import { swaggerSpec } from "@/lib/swagger";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function SwaggerPage() {
    return (
        <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
            <SwaggerUI spec={swaggerSpec} />
        </div>
    )
}