import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import TableServiceKendaraan from "../../components/tables/Servis/ServiceKendaraanTable";
import FormDisableKendaraan from "../../components/form/form-disable/KendaraanFormD";

export default function ServisKendaraan() {
  return (
    <>
      <PageMeta
        title="Riwayat Servis Kendaraan"
        description="Halaman detail kendaraan dan riwayat servisnya"
      />
      <PageBreadcrumb pageTitle="Servis Kendaraan" />
      <div className="space-y-6">
        <ComponentCard title="Detail Kendaraan">
          <FormDisableKendaraan />
        </ComponentCard>
        <ComponentCard title="Riwayat Servis Kendaraan">
          <TableServiceKendaraan />
        </ComponentCard>
      </div>
    </>
  );
}
