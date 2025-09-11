import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import FormDisableTanah from "../../components/form/form-disable/TanahFormD";

export default function DetailTanah() {
  return (
    <>
      <PageMeta
        title="Detail Aset Tanah"
        description="Halaman detail aset tanah"
      />
      <PageBreadcrumb pageTitle="Riwayat Tanah" />
      <div className="space-y-6">
        <ComponentCard title="Detail Tanah">
          <FormDisableTanah />
        </ComponentCard>
      </div>
    </>
  );
}
