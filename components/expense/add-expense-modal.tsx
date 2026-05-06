"use client";

import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";

export function AddExpenseModal({ open, onClose }: any) {
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4">
        Tambah Pengeluaran 💸
      </h2>

      <Input placeholder="Rp 0" />

      <div className="flex gap-2 mt-4 flex-wrap">
        <Chip label="🍜 Makan" />
        <Chip label="🚗 Transport" />
      </div>

      <Button className="mt-6">Simpan 💖</Button>
    </Modal>
  );
}