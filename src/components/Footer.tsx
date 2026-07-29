import { SiteContent } from "@/lib/types";

export default function Footer({ site }: { site: SiteContent }) {
  return (
    <div className="wrap">
      <footer>
        <span>{site.footerLeft}</span>
        <span>{site.footerRight}</span>
      </footer>
    </div>
  );
}
