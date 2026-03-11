import { useState, useEffect } from "react";
import { contentService } from "../services/dataService";

const About = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const data = await contentService.getAll();
        setContent(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching content:", err);
        setError("Sisällön haku epäonnistui.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <svg
          className="animate-spin h-10 w-10 text-orange"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="mt-4 text-prussian_blue font-medium">
          Ladataan tietoja...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="mt-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
        Ei näytettävää sisältöä.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="flex flex-col rounded-lg border border-alabaster_grey-400 bg-white overflow-hidden shadow-sm">
          {content.map((c, index) => (
            <button
              key={c.id || index}
              onClick={() => setActiveTab(index)}
              className={`text-left px-4 py-4 text-sm font-medium transition-colors border-b border-alabaster_grey-200 last:border-b-0 ${
                activeTab === index
                  ? "bg-orange text-prussian_blue"
                  : "text-black hover:bg-alabaster_grey-500"
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>
      <div className="md:col-span-2">
        <div className="bg-white rounded-lg border border-alabaster_grey-400 p-6 shadow-sm min-h-[30rem]">
          {content[activeTab] && (
            <div className="fade-in">
              <h2 className="text-2xl font-bold text-prussian_blue border-b border-alabaster_grey-300 pb-3 mb-6">
                {content[activeTab].title}
              </h2>
              <div
                className="prose prose-sm max-w-none text-black"
                dangerouslySetInnerHTML={{ __html: content[activeTab].text }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
