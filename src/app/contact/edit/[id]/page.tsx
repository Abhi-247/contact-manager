import ContactForm from "../../../_components/contactForm";

interface EditContactPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditContactPage = async ({ params }: EditContactPageProps) => {
  const { id } = await params;

  return (
    <div>
      <ContactForm contactId={id} />
    </div>
  );
};

export default EditContactPage;
