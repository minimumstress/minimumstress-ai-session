type Props = {
  title: string;
  status: string;
};

export default function SessionHeader({ title, status }: Props) {
  return (
    <div className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,1)]" />
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-white/35">
            Minimum Stress Session
          </div>
          <div className="text-sm font-medium text-white/85">{title}</div>
        </div>
      </div>

      <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-200">
        {status}
      </div>
    </div>
  );
}