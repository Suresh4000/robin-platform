import React from "react";
import Link from "next/link";
import { PublicNav, PublicFooter } from "@/app/PublicLayout";
import { RevealHook } from "@/app/RevealHook";

export default function NotFound() {
    return (
        <>
            <PublicNav />

            <main style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <section className="section text-center" data-bg-text="404" style={{ width: "100%" }}>
                    <div className="container">
                        <div className="section-head reveal" style={{ maxWidth: "600px", margin: "0 auto" }}>
                            <div className="eyebrow">404 Error</div>
                            <h1 className="section-title" style={{ fontSize: "4rem", marginBottom: "1rem" }}>Page Not Found</h1>
                            <p className="lead" style={{ marginBottom: "2rem" }}>
                                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                            </p>

                            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                                <Link href="/home" className="btn btn-brass">
                                    Return to Home
                                </Link>
                                <Link href="/contact" className="btn btn-ghost">
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <PublicFooter />
            <RevealHook />
        </>
    );
}
