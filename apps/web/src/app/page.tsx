import Link from "next/link";

function page() {
  return (
    <section>
      <div className="gap-5 space-x-5 bg-amber-200 rounded-2xl text-center flex items-center justify-center h-50">
        <Link className="bg-amber-500 rounded-2xl p-2" href={"/"}>
          2
        </Link>
        <Link className="bg-amber-500 rounded-2xl p-2" href={"/test"}>
          1
        </Link>
        <Link className="bg-amber-500 rounded-2xl p-2" href={"/test2"}>
          3
        </Link>
      </div>
    </section>
  );
}

export default page;
