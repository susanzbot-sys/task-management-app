export default function StatusBadge({ status }) {
  const className =
    status === 'Done'
      ? 'badge badge-done'
      : status === 'In Progress'
      ? 'badge badge-progress'
      : 'badge badge-todo';

  return <span className={className}>{status}</span>;
}
