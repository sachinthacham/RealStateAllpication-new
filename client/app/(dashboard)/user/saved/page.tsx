"use client";

import { useEffect, useState } from "react";
import { Bell, Filter, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { realEstateApi, SavedSearch } from "@/lib/api/realEstate";

export default function SavedSearchesPage() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newSearch, setNewSearch] = useState({
    name: "",
    city: "",
    type: "",
    minPrice: "",
    maxPrice: "",
    frequency: "daily" as "instant" | "daily" | "weekly",
  });

  const loadSavedSearches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await realEstateApi.getSavedSearches();
      setSavedSearches(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load saved searches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedSearches();
  }, []);

  const handleCreateSearch = async () => {
    if (!newSearch.name.trim()) return;

    try {
      setSaving(true);
      setError(null);
      await realEstateApi.createSavedSearch({
        name: newSearch.name.trim(),
        frequency: newSearch.frequency,
        isAlertEnabled: true,
        filters: {
          city: newSearch.city || undefined,
          type: newSearch.type || undefined,
          minPrice: newSearch.minPrice || undefined,
          maxPrice: newSearch.maxPrice || undefined,
        },
      });
      setNewSearch({
        name: "",
        city: "",
        type: "",
        minPrice: "",
        maxPrice: "",
        frequency: "daily",
      });
      await loadSavedSearches();
    } catch (err: any) {
      setError(err?.message || "Failed to create saved search");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAlerts = async (search: SavedSearch) => {
    try {
      setError(null);
      await realEstateApi.updateSavedSearch(search._id, {
        isAlertEnabled: !search.isAlertEnabled,
      });
      await loadSavedSearches();
    } catch (err: any) {
      setError(err?.message || "Failed to update alerts");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await realEstateApi.deleteSavedSearch(id);
      await loadSavedSearches();
    } catch (err: any) {
      setError(err?.message || "Failed to remove saved search");
    }
  };

  const handleRun = async (id: string) => {
    try {
      setError(null);
      await realEstateApi.runSavedSearch(id);
      await loadSavedSearches();
    } catch (err: any) {
      setError(err?.message || "Failed to run saved search");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Saved Searches</h1>

      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-blue-600" />
          <p className="text-blue-800">
            Save property filters and receive alerts when matching listings appear.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-sm text-gray-500">Loading saved searches...</div>
        ) : savedSearches.length === 0 ? (
          <div className="rounded-md border border-dashed p-6 text-sm text-gray-500">
            No saved searches yet.
          </div>
        ) : (
          savedSearches.map((search) => (
            <div key={search._id} className="border rounded-lg p-4 hover:border-blue-500">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Search className="w-5 h-5 text-gray-500" />
                    <h3 className="font-medium text-lg">{search.name}</h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded uppercase">
                      {search.frequency}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>Last matches: {search.lastResultCount}</span>
                    <span>
                      Last run:{" "}
                      {search.lastRunAt ? new Date(search.lastRunAt).toLocaleString() : "Never"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleRun(search._id)}>
                    Run
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleAlerts(search)}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    {search.isAlertEnabled ? "Alerts On" : "Alerts Off"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(search._id)}>
                    <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 pt-6 border-t space-y-3">
        <h3 className="text-lg font-semibold">Create New Search</h3>
        <Input
          value={newSearch.name}
          onChange={(e) => setNewSearch((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Search name (e.g., Colombo apartments)"
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            value={newSearch.city}
            onChange={(e) => setNewSearch((prev) => ({ ...prev, city: e.target.value }))}
            placeholder="City"
          />
          <Input
            value={newSearch.type}
            onChange={(e) => setNewSearch((prev) => ({ ...prev, type: e.target.value }))}
            placeholder="Type (house/apartment)"
          />
          <Input
            value={newSearch.minPrice}
            onChange={(e) => setNewSearch((prev) => ({ ...prev, minPrice: e.target.value }))}
            placeholder="Min price"
          />
          <Input
            value={newSearch.maxPrice}
            onChange={(e) => setNewSearch((prev) => ({ ...prev, maxPrice: e.target.value }))}
            placeholder="Max price"
          />
        </div>
        <div className="flex gap-3">
          <Button
            disabled={saving || !newSearch.name.trim()}
            onClick={handleCreateSearch}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <Filter className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Search"}
          </Button>
        </div>
      </div>
    </div>
  );
}