// Heading banner used at the top of the public pages
export default function PageBanner({ title, subtitle, icon }) {
  return (
    <section className="page-banner container">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <span className="banner-art">
        <i className={`fa-solid ${icon}`} />
      </span>
    </section>
  );
}
