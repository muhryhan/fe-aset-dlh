import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import TableTanah from "../components/tables/TanahTable";

export default function Tanah() {
  return (
    <>
      <PageMeta title="Tanah" description="Halaman List Data Aset Tanah" />
      <PageBreadcrumb pageTitle="Data Lokasi Tanah" />
      <div className="space-y-6">
        <TableTanah />
      </div>
    </>
  );
}
