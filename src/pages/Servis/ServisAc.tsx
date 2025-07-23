import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import TableServiceAc from "../../components/tables/Servis/ServisAcTable";
import FormAc from "../../components/form/form-disable/AcFormD";

export default function ServiceAc() {
  return (
    <>
      <PageMeta
        title="Riwayat Servis AC"
        description="Halaman Riwayat Servis AC"
      />
      <PageBreadcrumb pageTitle="Riwayat Servis AC" />
      <div className="space-y-6">
        <ComponentCard title="Data Ac">
          <FormAc />
        </ComponentCard>
        <ComponentCard title="Tabel Riwayat Servis AC">
          <TableServiceAc />
        </ComponentCard>
      </div>
    </>
  );
}
