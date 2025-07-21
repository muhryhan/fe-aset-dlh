import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import TableSerberKendaraan from "../../components/tables/ServisBerkala/SerberKendaraanTable";

export default function SerberKendaraan() {
  return (
    <>
      <PageMeta
        title="Servis Berkala Kendaraan"
        description="Ini adalah halaman servis berkala kendaraan"
      />
      <PageBreadcrumb pageTitle="Tanggal Servis Berkala Kendaraan" />
      <div className="space-y-6">
        <TableSerberKendaraan />
      </div>
    </>
  );
}
