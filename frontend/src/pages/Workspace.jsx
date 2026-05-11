import { useState } from "react";

import ChatStream from "@/components/ChatStream";
import ContextPanel from "@/components/ContextPanel";
import OrchestrationDrawer from "@/components/OrchestrationDrawer";

import { conversation } from "@/lib/mockData";

import { useChat } from "@/hooks/useChat";

import {
  ChevronRight,
  Clock,
  Globe,
} from "lucide-react";

export default function Workspace() {

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const {
    messages,
    loading,
    orchestration,
    sendChatMessage,
  } = useChat();

  return (
    <div className="px-6 lg:px-10 pt-6 pb-10">

      {/* Workspace Header */}

      <div className="flex items-end justify-between mb-6">

        <div>

          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#5C5F66] mb-2">

            <span>Workspace</span>

            <ChevronRight className="h-3 w-3" />

            <span>Active conversation</span>

            <ChevronRight className="h-3 w-3" />

            <span>{conversation.id}</span>

          </div>

          <h1 className="font-display text-[26px] font-medium text-[#ededed] tracking-tight">

            {conversation.customer.name}

          </h1>

          <div className="flex items-center gap-4 mt-1.5 text-[12px] text-[#8A8F98]">

            <span className="flex items-center gap-1.5">

              <Clock className="h-3 w-3" />

              Started {conversation.startedAt}

            </span>

            <span className="flex items-center gap-1.5">

              <Globe className="h-3 w-3" />

              {conversation.language}

            </span>

            <span className="font-mono text-[11px] text-[#5C5F66]">

              tenure · {conversation.customer.tenure}

            </span>

          </div>
        </div>

        {/* Actions */}

        <div className="hidden md:flex items-center gap-2">

          <button className="h-8 px-3 border border-[#1F1F22] rounded-md text-[12px] text-[#ededed] hover:border-[#2A2A2E] transition-colors">

            Mark resolved

          </button>

          <button
            onClick={() =>
              setDrawerOpen(true)
            }
            className="h-8 px-3 border border-[#00E5FF]/30 text-[#00E5FF] rounded-md text-[12px] hover:bg-[#00E5FF]/10 transition-colors"
          >
            Orchestration
          </button>

        </div>
      </div>

      {/* Main Grid */}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Chat Area */}

        <div className="xl:col-span-8 h-[calc(100vh-220px)] min-h-[560px]">

          <ChatStream
            conversation={conversation}
            messages={messages}
            loading={loading}
            sendChatMessage={sendChatMessage}
          />

        </div>

        {/* Context Panel */}

        <div className="xl:col-span-4">

          <ContextPanel
            conversation={conversation}
            orchestration={orchestration}
            onOpenOrchestration={() =>
              setDrawerOpen(true)
            }
          />

        </div>
      </div>

      {/* Orchestration Drawer */}

    <OrchestrationDrawer
  open={drawerOpen}
  onOpenChange={setDrawerOpen}
  orchestration={orchestration}
/>
    </div>
  );
}