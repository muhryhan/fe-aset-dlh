import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import TableServiceAlatBerat from "../../components/tables/Servis/ServiceAlatBeratTable";
import FormDisableAlatBerat from "../../components/form/form-disable/AlatBeratFormD";

export default function ServiceAlatBerat() {
  return (
    <>
      <PageMeta
        title="Riwayat Servis Alat Berat"
        description="Halaman detail alat berat dan riwayat servisnya"
      />
      <PageBreadcrumb pageTitle="Riwayat Servis Alat Berat" />
      <div className="space-y-6">
        <ComponentCard title="Detail Alat Berat">
          <FormDisableAlatBerat />
        </ComponentCard>
        <ComponentCard title="Tabel Riwayat Servis Alat Berat">
          <TableServiceAlatBerat />
        </ComponentCard>
      </div>
    </>
  );
}
