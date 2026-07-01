import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Save, Copy, FolderPlus } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import Input from "../components/common/Input";
import AddToDeckMenu from "../components/AddToDeckMenu";
import { getFlashcard } from "../services/flashcard";
import { updateFlashcardInDeck } from "../services/deck";
import { useAuth } from "../contexts/AuthContext";

const JLPT_LEVELS = ["N5", "N4", "N3", "N2", "N1"];
const CARD_TYPES = ["Vocabulary", "Kanji", "Grammar", "Expression"];

const FIELDS = [
  ["expression", "Expression", "text"],
  ["reading", "Reading", "text"],
  ["reading_romaji", "Reading (romaji)", "text"],
  ["meaning", "Meaning", "text"],
  ["example_sentence", "Example sentence", "text"],
  ["example_romaji", "Example (romaji)", "text"],
  ["example_translation", "Example translation", "text"],
  ["notes", "Notes", "text"],
];

export default function FlashcardEditor() {
  const { deckId, flashcardId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [card, setCard] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForkChoice, setShowForkChoice] = useState(false);
  const [showOtherDeckPicker, setShowOtherDeckPicker] = useState(false);

  useEffect(() => {
    async function fetchCard() {
      try {
        const data = await getFlashcard(flashcardId);
        setCard(data);
        setForm({
          expression: data.expression || "",
          reading: data.reading || "",
          reading_romaji: data.reading_romaji || "",
          meaning: data.meaning || "",
          example_sentence: data.example_sentence || "",
          example_romaji: data.example_romaji || "",
          example_translation: data.example_translation || "",
          notes: data.notes || "",
          jlpt_level: data.jlpt_level || "",
          card_type: data.card_type || "",
        });
      } catch (err) {
        setError(err.message || "Couldn't load flashcard");
      } finally {
        setLoading(false);
      }
    }
    fetchCard();
  }, [flashcardId]);

  const isOwned = card && user && card.owner_id === user.id;

  function buildUpdates() {
    const updates = {};
    for (const key of Object.keys(form)) {
      const value = form[key] === "" ? null : form[key];
      if (value !== (card[key] ?? "")) updates[key] = value;
    }
    return updates;
  }

  async function save(mode, targetDeckId = null) {
    setSaving(true);
    setError(null);
    try {
      await updateFlashcardInDeck(deckId, flashcardId, buildUpdates(), mode, targetDeckId);
      navigate(`/decks/${deckId}`);
    } catch (err) {
      setError(err.message || "Couldn't save changes");
      setSaving(false);
    }
  }

  function handleSaveClick() {
    if (isOwned) {
      save("replace");
    } else {
      setShowForkChoice(true);
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-2xl py-20 flex justify-center">
          <Loader2 size={24} className="animate-spin" style={{ color: "var(--muted-foreground)" }} />
        </div>
      </MainLayout>
    );
  }

  if (error && !form) {
    return (
      <MainLayout>
        <p className="text-sm" style={{ color: "var(--primary)" }}>{error}</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/decks/${deckId}`)}
            className="grid h-9 w-9 place-items-center rounded-full border transition hover:opacity-70"
            style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--foreground)" }}
            aria-label="Back to deck"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-xl font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
            Edit Flashcard
          </h1>
        </div>

        {!isOwned && (
          <p className="text-sm rounded-xl border px-4 py-3" style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--muted-foreground)" }}>
            This is an official card. Saving will create your own copy — you'll choose what happens to it next.
          </p>
        )}

        <div className="space-y-4 rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          {FIELDS.map(([key, label]) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                {label}
              </label>
              <Input
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                JLPT Level
              </label>
              <select
                value={form.jlpt_level}
                onChange={(e) => setForm({ ...form, jlpt_level: e.target.value })}
                className="h-11 w-full rounded-xl px-4 outline-none"
                style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
              >
                <option value="">None</option>
                {JLPT_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                Card Type
              </label>
              <select
                value={form.card_type}
                onChange={(e) => setForm({ ...form, card_type: e.target.value })}
                className="h-11 w-full rounded-xl px-4 outline-none"
                style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
              >
                {CARD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {error && <p className="text-sm" style={{ color: "var(--primary)" }}>{error}</p>}

        {!showForkChoice ? (
          <button
            onClick={handleSaveClick}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
            style={{ background: "var(--primary)", color: "var(--primary-foreground, #fff)" }}
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Save Changes
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              This card isn't yours — how should the edit be saved?
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => save("replace")}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--primary)", color: "var(--primary-foreground, #fff)" }}
              >
                <Save size={14} />
                Replace in this deck
              </button>
              <button
                onClick={() => save("add_to_deck")}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition hover:opacity-80 disabled:opacity-50"
                style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                <Copy size={14} />
                Keep both, in this deck
              </button>
              <div className="relative">
                <button
                    onClick={() => setShowOtherDeckPicker((v) => !v)}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition hover:opacity-80 disabled:opacity-50"
                    style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                    <FolderPlus size={14} />
                    Add copy to another deck
                </button>
                {showOtherDeckPicker && (
                    <div className="absolute left-0 z-10 mt-2">
                    <AddToDeckMenu
                        flashcardId={flashcardId}
                        onSelect={(targetDeckId) => save("add_to_other_deck", targetDeckId)}
                        hideTrigger
                        forceOpen
                    />
                    </div>
                )}
                </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}