export default function TermsPage() {

  return (
    <div className="flex flex-column align-items-center justify-content-center flex-1 page-responsive-padding" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="w-full max-w-screen-lg">
        <div className="bg-white border-round shadow-2 p-4" style={{ minHeight: '600px' }}>
          <iframe
            src="https://www.cptgroupcaseinfo.com/terms-of-use-policy.htm"
            className="w-full border-0"
            style={{ height: '600px', minHeight: '600px' }}
            title="Terms of Use"
            aria-label="Terms of Use"
          />
        </div>
      </div>
    </div>
  );
}

