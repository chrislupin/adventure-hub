'use client';

import { useState } from 'react';
import { CatalogCard } from '@/components/services/catalog-card';
import { Button, EmptyState, FormField, SelectField } from '@/components/ui/primitives';
import type { CatalogEntry, PackageEntry, PricingInformation } from '@/types/catalog';

type VerifiedPrice = Extract<PricingInformation, { method: 'fixed' | 'from' }>;

function hasVerifiedPrice(entry: PackageEntry): entry is PackageEntry & { pricing: VerifiedPrice } {
  const pricing = entry.pricing;
  return (pricing.method === 'fixed' || pricing.method === 'from') && pricing.verified;
}

export function CatalogBrowser({
  entries,
  detailPath,
  searchLabel,
  emptyTitle,
  emptyDescription,
}: {
  entries: readonly CatalogEntry[];
  detailPath: string;
  searchLabel: string;
  emptyTitle: string;
  emptyDescription: string;
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [mealPlan, setMealPlan] = useState('all');
  const [accommodation, setAccommodation] = useState('all');
  const [duration, setDuration] = useState('all');
  const [minimumPrice, setMinimumPrice] = useState('');
  const [maximumPrice, setMaximumPrice] = useState('');
  const categories = [...new Set(entries.map((entry) => entry.category))].sort((left, right) => left.localeCompare(right));
  const packages = entries.filter((entry): entry is PackageEntry => entry.kind === 'package');
  const mealPlans = [...new Set(packages.map((entry) => entry.packageDetails.mealPlan))];
  const accommodations = [...new Set(packages.map((entry) => entry.packageDetails.accommodation).filter((value): value is string => Boolean(value)))];
  const durations = [...new Set(packages.map((entry) => entry.packageDetails.duration).filter((value): value is string => Boolean(value)))];
  const pricedPackages = packages.filter(hasVerifiedPrice);
  const currencies = [...new Set(pricedPackages.map((entry) => entry.pricing.currency))];
  const configuredAmounts = [...new Set(pricedPackages.map((entry) => entry.pricing.amount))].sort((left, right) => left - right);
  const showPriceRange = currencies.length === 1 && configuredAmounts.length > 1;
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const visibleEntries = entries.filter((entry) => {
    const matchesCategory = category === 'all' || entry.category === category;
    const packageText = entry.kind === 'package'
      ? `${entry.packageDetails.accommodation ?? ''} ${entry.packageDetails.duration ?? ''} ${entry.packageDetails.mealPlan} ${(entry.packageDetails.includedActivities ?? []).join(' ')}`
      : '';
    const searchableText = `${entry.name} ${entry.shortDescription} ${entry.category} ${packageText}`.toLocaleLowerCase();
    const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
    const matchesPackageFields = entry.kind !== 'package' || (
      (mealPlan === 'all' || entry.packageDetails.mealPlan === mealPlan)
      && (accommodation === 'all' || entry.packageDetails.accommodation === accommodation)
      && (duration === 'all' || entry.packageDetails.duration === duration)
    );
    const hasPriceConstraint = minimumPrice !== '' || maximumPrice !== '';
    const matchesPrice = !hasPriceConstraint || (
      entry.kind === 'package'
      && (entry.pricing.method === 'fixed' || entry.pricing.method === 'from')
      && entry.pricing.verified
      && (minimumPrice === '' || entry.pricing.amount >= Number(minimumPrice))
      && (maximumPrice === '' || entry.pricing.amount <= Number(maximumPrice))
    );
    return matchesCategory && matchesSearch && matchesPackageFields && matchesPrice;
  });
  const filtersActive = Boolean(search || category !== 'all' || mealPlan !== 'all' || accommodation !== 'all' || duration !== 'all' || minimumPrice || maximumPrice);

  function clearFilters() {
    setSearch('');
    setCategory('all');
    setMealPlan('all');
    setAccommodation('all');
    setDuration('all');
    setMinimumPrice('');
    setMaximumPrice('');
  }

  return (
    <>
      {entries.length > 1 && (
        <div className="mb-8 grid gap-4 border-b border-[#dcded4] pb-6 sm:grid-cols-[minmax(16rem,1fr)_minmax(12rem,0.55fr)] sm:items-end">
          <FormField id="catalog-search" label={searchLabel} type="search" placeholder="Search by name or category" value={search} onChange={(event) => setSearch(event.currentTarget.value)} />
          {categories.length > 1 && (
            <SelectField id="catalog-category" label="Filter by category" value={category} onChange={(event) => setCategory(event.currentTarget.value)}>
              <option value="all">All categories</option>
              {categories.map((option) => <option key={option} value={option}>{option}</option>)}
            </SelectField>
          )}
          {mealPlans.length > 1 && (
            <SelectField id="package-meal-plan" label="Meal plan" value={mealPlan} onChange={(event) => setMealPlan(event.currentTarget.value)}>
              <option value="all">All meal plans</option>
              {mealPlans.map((option) => <option key={option} value={option}>{option}</option>)}
            </SelectField>
          )}
          {accommodations.length > 1 && (
            <SelectField id="package-accommodation" label="Accommodation" value={accommodation} onChange={(event) => setAccommodation(event.currentTarget.value)}>
              <option value="all">All accommodation</option>
              {accommodations.map((option) => <option key={option} value={option}>{option}</option>)}
            </SelectField>
          )}
          {durations.length > 1 && (
            <SelectField id="package-duration" label="Duration" value={duration} onChange={(event) => setDuration(event.currentTarget.value)}>
              <option value="all">All durations</option>
              {durations.map((option) => <option key={option} value={option}>{option}</option>)}
            </SelectField>
          )}
          {showPriceRange && (
            <div className="grid gap-4 sm:grid-cols-2 sm:col-span-2">
              <FormField id="package-minimum-price" label={`Minimum price (${currencies[0]})`} type="number" min={configuredAmounts[0]} max={configuredAmounts.at(-1)} step="any" value={minimumPrice} onChange={(event) => setMinimumPrice(event.currentTarget.value)} placeholder={String(configuredAmounts[0])} />
              <FormField id="package-maximum-price" label={`Maximum price (${currencies[0]})`} type="number" min={configuredAmounts[0]} max={configuredAmounts.at(-1)} step="any" value={maximumPrice} onChange={(event) => setMaximumPrice(event.currentTarget.value)} placeholder={String(configuredAmounts.at(-1))} />
            </div>
          )}
        </div>
      )}
      {visibleEntries.length > 0 ? (
        <>
          {entries.length > 1 && <p aria-live="polite" className="mb-5 text-xs text-[#59645d]">Showing {visibleEntries.length} of {entries.length}</p>}
          <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
            {visibleEntries.map((entry, index) => <CatalogCard key={entry.id} entry={entry} href={`${detailPath}/${entry.slug}`} priority={index === 0} />)}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <EmptyState title={search || category !== 'all' ? 'No matching services' : emptyTitle} description={search || category !== 'all' ? 'Try a different search or category filter.' : emptyDescription} />
          {filtersActive && (
            <div className="text-center">
              <Button type="button" variant="text" onClick={clearFilters}>Clear filters</Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}