export default async function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Proposal detail</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Proposal {id}</h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        Empty SSR detail route. Add server-loaded proposal content, status transitions, export, and audit events here.
      </p>
    </main>
  );
}
