export default function DataTable({ array }: { array: any }) {
  return (
    <table className="w-full pt-4 text-sm text-center bg-white text-zinc-500 dark:text-zinc-200 dark:bg-zinc-900">
      <thead>
        <tr>
          {array &&
            array.columns &&
            array.columns.map((e: string, index: any) => {
              return (
                <th className="px-6 py-4 text-lg font-bold" key={e}>
                  {e}
                </th>
              );
            })}
        </tr>
      </thead>
      <tbody>
        {array &&
          array.map((row: any, index: any) => {
            return (
              <tr
                className="border-b text-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
                key={index}
              >
                {Object.keys(row).map((e, v) => {
                  return (
                    <td key={e} className="px-6 py-2">
                      {row[e]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
