import { getAllDepartments } from "@/utils/departments";
import DepartmentPageContent from "@/pages/DepartmentPage";

export async function generateStaticParams() {
    const departments = await getAllDepartments();
    return departments.map(department => ({
        slug: department.slug,
    }));
}
export default function DepartmentPage() {
    return <DepartmentPageContent />;
}