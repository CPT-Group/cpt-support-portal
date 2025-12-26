export default function PrivacyPage() {

  return (
    <div className="flex flex-column align-items-center justify-content-center page-responsive-padding" style={{ paddingTop: '2rem', paddingBottom: '2rem', minHeight: 'calc(100vh - 10rem)' }}>
      <div className="w-full max-w-screen-lg">
        <div className="bg-white border-round shadow-2 p-4" style={{ minHeight: '600px' }}>
          <iframe
            src="https://www.cptgroupcaseinfo.com/privacy-policy.htm"
            className="w-full border-0"
            style={{ height: '600px', minHeight: '600px' }}
            title="Privacy Policy"
            aria-label="Privacy Policy"
          />
        </div>
      </div>
    </div>
  );
}

