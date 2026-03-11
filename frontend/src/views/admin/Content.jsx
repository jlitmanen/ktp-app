import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { contentService } from "../../services/dataService";

const AdminContent = () => {
  const [contentList, setContentList] = useState([]);
  const [editingContent, setEditingContent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const data = await contentService.getAll();
      setContentList(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching content:", err);
      setError("Sisältöjen haku epäonnistui.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingContent({ title: "", text: "" });
    setIsEditing(true);
  };

  const handleEdit = (content) => {
    setEditingContent({ ...content });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingContent.id) {
        await contentService.update(editingContent.id, editingContent);
      } else {
        await contentService.create(editingContent);
      }
      setIsEditing(false);
      setEditingContent(null);
      fetchContent(); // Refresh list
    } catch (err) {
      console.error("Error saving content:", err);
      setError("Tallennus epäonnistui.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Haluatko varmasti poistaa tämän sisällön?")) {
      try {
        await contentService.delete(id);
        fetchContent();
      } catch (err) {
        console.error("Error deleting content:", err);
        setError("Poisto epäonnistui.");
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingContent(null);
  };

  if (loading && !isEditing) {
    return (
      <div className="flex justify-center p-12">
        <svg
          className="animate-spin h-8 w-8 text-orange"
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
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-lg border border-alabaster_grey-400 shadow-sm overflow-hidden">
          <div className="bg-prussian_blue px-6 py-4 border-b border-orange">
            <h3 className="text-xl font-bold text-white">
              {editingContent?.id ? "Muokkaa sisältöä" : "Lisää uusi sisältö"}
            </h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-prussian_blue mb-2">
                  Otsikko
                </label>
                <input
                  type="text"
                  className="block w-full px-4 py-3 bg-white border border-alabaster_grey-400 rounded-md shadow-sm focus:outline-none focus:ring-orange focus:border-orange text-lg"
                  value={editingContent?.title || ""}
                  onChange={(e) =>
                    setEditingContent({
                      ...editingContent,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="quill-editor-container">
                <label className="block text-sm font-bold text-prussian_blue mb-2">
                  Sisältö
                </label>
                <ReactQuill
                  theme="snow"
                  value={editingContent?.text || ""}
                  onChange={(content) =>
                    setEditingContent({
                      ...editingContent,
                      text: content,
                    })
                  }
                  modules={modules}
                  formats={formats}
                  className="bg-white h-64 mb-12"
                />
              </div>

              <div className="flex flex-col md:flex-row justify-end gap-4 mt-8">
                <button
                  type="button"
                  className="px-6 py-3 border border-alabaster_grey-400 text-black font-medium rounded-md hover:bg-alabaster_grey-800 transition-colors"
                  onClick={handleCancel}
                >
                  Peruuta
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-orange text-prussian_blue font-bold rounded-md hover:bg-orange-600 transition-colors shadow-md"
                >
                  Tallenna muutokset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          className="px-6 py-3 bg-orange text-prussian_blue font-bold rounded-md hover:bg-orange-600 transition-colors shadow-md"
          onClick={handleAdd}
        >
          Lisää uusi osio
        </button>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </button>
        </div>
      )}

      <div className="overflow-x-auto border border-alabaster_grey-400 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-alabaster_grey-300">
          <thead className="bg-prussian_blue">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-orange uppercase tracking-wider">
                Otsikko
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-bold text-orange uppercase tracking-wider"
                style={{ width: "120px" }}
              >
                Toiminnot
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-alabaster_grey-200">
            {contentList.length > 0 ? (
              contentList.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-alabaster_grey-800 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                    {c.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end gap-3">
                      <button
                        className="text-prussian_blue hover:text-orange transition-colors p-2"
                        onClick={() => handleEdit(c)}
                        title="Muokkaa"
                      >
                        <i className="fa fa-edit text-lg"></i>Muokkaa
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 transition-colors p-2"
                        onClick={() => handleDelete(c.id)}
                        title="Poista"
                      >
                        <i className="fa fa-trash text-lg"></i>Poista
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="2"
                  className="px-6 py-10 text-center text-alabaster_grey-300 italic"
                >
                  Ei sisältöjä löytynyt.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminContent;
