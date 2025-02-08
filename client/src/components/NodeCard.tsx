interface NodeCardProps {
  title: string;
  description: string;
  children: React.ReactElement | React.ReactElement[];
}
/** default wrapper for all nodes */
export default function NodeCard(props: NodeCardProps) {
  return (
    <div className="flex flex-col items-start text-start rounded-lg border bg-card text-card-foreground p-4 min-w-40">
      <div className="mb-4">
        <p className="text-sm font-medium leading-none">{props.title}</p>
        <p className="text-xs text-muted-foreground">{props.description}</p>
      </div>
      {props.children}
    </div>
  );
}
