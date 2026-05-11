
import { useState } from "react";

import { sendMessage } from "../api/client";


export function useChat() {

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // =====================================
  // ORCHESTRATION STATE
  // =====================================

  const [orchestration, setOrchestration] =
    useState({

      intent: "",

      flow: "",

      confidence: 0,

      sentiment: "",

      urgency: "",

      risk_level: "",

      requires_escalation: false,

      customer_state: "",

      business_impact: "",

      trace: {},
    });

  // =====================================
  // SEND MESSAGE
  // =====================================

  const sendChatMessage = async (
    text
  ) => {

    if (!text.trim()) return;

    const timestamp =
      new Date().toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit",
      });

    // ===================================
    // USER MESSAGE
    // ===================================

    const userMessage = {

      id: Date.now().toString(),

      role: "user",

      content: text,

      timestamp,
    };

    setMessages((prev) => [

      ...prev,

      userMessage,
    ]);

    setLoading(true);

    try {

      const response =
        await sendMessage(text);

      console.log(
        "\nCHAT RESPONSE:",
        response
      );

      // =================================
      // AI MESSAGE
      // =================================

      const aiMessage = {

        id:
          (Date.now() + 1)
          .toString(),

        role: "assistant",

        content:

          response.reply ||

          "No response generated.",

        timestamp:
          new Date()
          .toLocaleTimeString([], {

            hour: "2-digit",

            minute: "2-digit",
          }),

        metadata: {

          intent:
            response.intent,

          flow:
            response.flow,

          confidence:
            response.confidence,

          sentiment:
            response.sentiment,

          urgency:
            response.urgency,

          risk_level:
            response.risk_level,

          requires_escalation:

            response
            .requires_escalation,

          customer_state:

            response
            .customer_state,

          business_impact:

            response
            .business_impact,

          trace:
            response.trace,
        },
      };

      // =================================
      // SAVE MESSAGE
      // =================================

      setMessages((prev) => [

        ...prev,

        aiMessage,
      ]);

      // =================================
      // UPDATE ORCHESTRATION PANEL
      // =================================

      setOrchestration({

        intent:
          response.intent,

        flow:
          response.flow,

        confidence:
          response.confidence,

        sentiment:
          response.sentiment,

        urgency:
          response.urgency,

        risk_level:
          response.risk_level,

        requires_escalation:

          response
          .requires_escalation,

        customer_state:

          response
          .customer_state,

        business_impact:

          response
          .business_impact,

        trace:
          response.trace || {},
      });

    } catch (error) {

      console.error(
        "\nCHAT ERROR:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  return {

    messages,

    loading,

    orchestration,

    sendChatMessage,
  };
}

