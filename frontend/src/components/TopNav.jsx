import { Link, useLocation } from "react-router-dom";


export default function TopNav() {

  const location =
    useLocation();

  function navClass(path) {

    const active =
      location.pathname === path;

    return `
      px-4
      py-2
      rounded-md
      text-[13px]
      transition-all
      duration-200
      border-b
      ${
        active
          ? "text-[#ededed] border-[#00E5FF]"
          : "text-[#8A8F98] border-transparent hover:text-[#ededed]"
      }
    `;
  }

  return (

    <header
      className="
        h-16
        border-b
        border-[#1F1F22]
        bg-[#050505]
        flex
        items-center
        justify-between
        px-6
      "
    >

      {/* LEFT */}

      <div className="flex items-center gap-8">

        {/* LOGO */}

        <div className="flex items-center gap-3">

          <div
            className="
              w-5
              h-5
              rounded-full
              bg-[#00E5FF]
            "
          />

          <div className="flex items-center gap-2">

            <span className="
              text-[#ededed]
              font-medium
              text-[15px]
            ">

              Aurora

            </span>

            <span className="
              text-[#5C5F66]
              text-[11px]
              tracking-[0.3em]
              uppercase
            ">

              Telecom AI

            </span>

          </div>

        </div>

        {/* NAV */}

        <nav className="flex items-center gap-2">

          <Link
            to="/workspace"
            className={navClass(
              "/workspace"
            )}
          >

            Workspace

          </Link>

          <Link
            to="/analytics"
            className={navClass(
              "/analytics"
            )}
          >

            Analytics

          </Link>

          <Link
            to="/chat"
            className={navClass(
              "/chat"
            )}
          >

            Agent Desk

          </Link>

        </nav>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-3">

        <input
          type="text"
          placeholder="Search conversations, intents..."
          className="
            w-[260px]
            h-9
            bg-[#0A0A0B]
            border
            border-[#1F1F22]
            rounded-md
            px-3
            text-[13px]
            text-[#ededed]
            outline-none
          "
        />

        <div
          className="
            h-9
            px-3
            rounded-md
            border
            border-[#1F1F22]
            flex
            items-center
            gap-2
            text-[12px]
            text-[#8A8F98]
          "
        >

          <div
            className="
              w-2
              h-2
              rounded-full
              bg-[#2DD4BF]
            "
          />

          PROD

        </div>

      </div>

    </header>
  );
}