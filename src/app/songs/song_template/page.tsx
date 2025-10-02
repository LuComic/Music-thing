export default function Page() {
  return (
    <div className="bg-black h-screen max-w-screen w-screen flex items-center justify-center p-4">
      <div className="rounded-3xl flex flex-col md:grid grid-cols-3 gap-8 w-full md:w-[80%] p-6 md:p-10">
        <div className="flex flex-col gap-6 col-span-1">
          <div className="w-full aspect-square rounded-2xl bg-slate-300"></div>
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-3xl font-semibold">
              All Along The Watchtower
            </h1>
            <h2 className="text-slate-400 text-xl">
              The Jimi Hendrix Experience
            </h2>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-6 text-white col-span-2">
          <p className="text-lg leading-relaxed ">
            Hendrix&apos;s take on Bob Dylan&apos;s parable turns the cryptic
            folk tune into a psychedelic storm. Recorded in London during a
            feverish overnight session, the track layers searing guitar leads,
            stacked percussion, and urgent vocals that build tension from the
            first cymbal swell to the final wail.
          </p>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col border border-slate-800 rounded-2xl p-4">
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Album
              </dt>
              <dd className="text-white text-base">Electric Ladyland (1968)</dd>
            </div>
            <div className="flex flex-col border border-slate-800 rounded-2xl p-4">
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Label
              </dt>
              <dd className="text-white text-base">Reprise Records</dd>
            </div>
            <div className="flex flex-col border border-slate-800 rounded-2xl p-4">
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Produced By
              </dt>
              <dd className="text-white text-base">
                Jimi Hendrix &amp; Chas Chandler
              </dd>
            </div>
            <div className="flex flex-col border border-slate-800 rounded-2xl p-4">
              <dt className="text-slate-400 text-xs uppercase tracking-wide">
                Running Time
              </dt>
              <dd className="text-white text-base">4 minutes, 1 second</dd>
            </div>
          </dl>
          <div className="flex flex-col gap-3 text-sm md:text-base">
            <p>
              <span className="text-slate-400">Release context:</span> the cover
              debuted as the third single from Hendrix&apos;s double LP and
              quickly became the definitive version, praised by Dylan himself.
            </p>
            <p>
              <span className="text-slate-400">Notable detail:</span> Hendrix
              tracked more than a dozen guitar overdubs, ultimately weaving
              three separate solos into the final mix.
            </p>
            <p>
              <span className="text-slate-400">Legacy:</span> the recording is a
              cornerstone of classic rock radio and a staple in guitar pedagogy,
              celebrated for its expressive bends and dynamic crescendos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
