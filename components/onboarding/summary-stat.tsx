export function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#77806f]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#172014]">{value}</p>
    </div>
  );
}
