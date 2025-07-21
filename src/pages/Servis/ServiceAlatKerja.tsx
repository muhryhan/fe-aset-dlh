import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import TableServiceAlatKerja from "../../components/tables/Servis/ServiceAlatKerjaTable";
import FormDisableAlatKerja from "../../components/form/form-disable/AlatKerjaFormD";

export default function ServiceAlatKerja() {
  return (
    <>
      <PageMeta
        title="Riwayat Servis Alat Kerja"
        description="Halaman detail alat kerja dan riwayat servisnya"
      />
      <PageBreadcrumb pageTitle="Riwayat Servis Alat Kerja" />
      <div className="space-y-6">
        <ComponentCard title="Detail Alat Kerja">
          <FormDisableAlatKerja />
        </ComponentCard>
        <ComponentCard title="Tabel Riwayat Servis Alat Kerja">
          <TableServiceAlatKerja />
        </ComponentCard>
      </div>
    </>
  );
}
