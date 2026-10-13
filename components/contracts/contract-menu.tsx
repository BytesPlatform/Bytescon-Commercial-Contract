"use client";

import { Eye, ExternalLink, Flag, KanbanSquare, Link2, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Menu, MenuItem, MenuLabel, MenuSeparator } from "@/components/ui/menu";
import { Modal } from "@/components/ui/overlay";
import { STATUS_STYLES } from "@/lib/status";
import { deleteContract, setStatus, togglePursued } from "@/lib/store";
import { toast } from "@/lib/toast";
import { CONTRACT_STATUSES, type CommercialContract } from "@/lib/types";
import { cn, isSafeHttpUrl } from "@/lib/utilities";

type TriggerProps = Parameters<React.ComponentProps<typeof Menu>["trigger"]>[0];

/** Shared "more actions" menu for a contract (table rows, detail page, pipeline cards). */
export function ContractMenu({
  contract,
  onEdit,
  trigger,
  showView = true,
  showStatus = true,
  onDeleted,
}: {
  contract: CommercialContract;
  onEdit?: () => void;
  trigger: (props: TriggerProps) => ReactNode;
  showView?: boolean;
  showStatus?: boolean;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const href = `/commercial-opportunities/${contract.id}`;

  return (
    <>
      <Menu width={224} trigger={trigger}>
        {(close) => (
          <>
            {showView && (
              <MenuItem icon={<Eye />} onSelect={() => (close(), router.push(href))}>
                View details
              </MenuItem>
            )}
            {onEdit && (
              <MenuItem icon={<Pencil />} onSelect={() => (close(), onEdit())}>
                Edit contract
              </MenuItem>
            )}
            <MenuItem
              icon={<Flag />}
              onSelect={() => {
                close();
                togglePursued(contract.id);
                toast(contract.pursued ? "Pursuit flag removed" : "Marked as pursued", contract.title);
              }}
            >
              {contract.pursued ? "Remove pursuit flag" : "Mark as pursued"}
            </MenuItem>
            {isSafeHttpUrl(contract.sourceUrl) && (
              <MenuItem
                icon={<ExternalLink />}
                onSelect={() => {
                  close();
                  window.open(contract.sourceUrl, "_blank", "noopener,noreferrer");
                }}
              >
                Open source link
              </MenuItem>
            )}
            <MenuItem
              icon={<Link2 />}
              onSelect={() => {
                close();
                navigator.clipboard
                  ?.writeText(`${window.location.origin}${href}`)
                  .then(() => toast("Link copied"))
                  .catch(() => toast("Couldn’t copy link"));
              }}
            >
              Copy link
            </MenuItem>
            {!showView && (
              <MenuItem icon={<KanbanSquare />} onSelect={() => (close(), router.push("/pipeline"))}>
                View in pipeline
              </MenuItem>
            )}
            {showStatus && (
              <>
                <MenuSeparator />
                <MenuLabel>Move to stage</MenuLabel>
                {CONTRACT_STATUSES.map((s) => (
                  <MenuItem
                    key={s}
                    checked={contract.status === s}
                    icon={<span className={cn("block size-2 rounded-full", STATUS_STYLES[s].dot)} />}
                    onSelect={() => {
                      close();
                      if (s !== contract.status) {
                        setStatus(contract.id, s);
                        toast(`Moved to ${s}`, contract.title);
                      }
                    }}
                  >
                    {s}
                  </MenuItem>
                ))}
              </>
            )}
            {!contract.isSeeded && (
              <>
                <MenuSeparator />
                <MenuItem danger icon={<Trash2 />} onSelect={() => (close(), setConfirming(true))}>
                  Delete contract
                </MenuItem>
              </>
            )}
          </>
        )}
      </Menu>
      <Modal
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Delete this contract?"
        description={`“${contract.title}” and its checklist and activity will be removed from this browser. This can’t be undone.`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirming(false)} data-autofocus>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setConfirming(false);
                deleteContract(contract.id);
                toast("Contract deleted", contract.title);
                onDeleted?.();
              }}
            >
              Delete
            </Button>
          </>
        }
      />
    </>
  );
}
