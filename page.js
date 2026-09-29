 "use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownCircle, ArrowUpCircle, Wallet, Plus, Trash2,
  CalendarDays, ReceiptText, PiggyBank
} from "lucide-react";

const initialEntries = [];

function money(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function Home() {
  const [entries, setEntries] = useState(initialEntries);
  const [type, setType] = useState("entrada");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(today());

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gestao-familiar-entries");
      if (saved) setEntries(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("gestao-familiar-entries", JSON.stringify(entries));
  }, [entries]);

  const received = useMemo(
    () => entries.filter(e => e.type === "entrada").reduce((s, e) => s + e.value, 0),
    [entries]
  );

  const bills = useMemo(
    () => entries.filter(e => e.type === "saida").reduce((s, e) => s + e.value, 0),
    [entries]
  );

  const balance = received - bills;

  // Divisão solicitada: 50% dos recebidos para contas.
  const allocationBills = received * 0.50;
  const remainingAllocation = received * 0.50;

  function addEntry(e) {
    e.preventDefault();
    const numeric = Number(value.replace(",", "."));
    if (!name.trim() || !numeric || numeric <= 0) return;

    setEntries(prev => [
      {
        id: crypto.randomUUID(),
        type,
        name: name.trim(),
        value: numeric,
        date
      },
      ...prev
    ]);

    setName("");
    setValue("");
    setDate(today());
  }

  function removeEntry(id) {
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <div className="brand"><Wallet size={24}/> Gestão Familiar</div>
          <p>Organize suas entradas, contas e objetivos.</p>
        </div>
      </header>

      <section className="container">
        <div className="hero">
          <div>
            <span className="eyebrow">CONTROLE FINANCEIRO</span>
            <h1>Seu dinheiro, <span>organizado.</span></h1>
            <p>Cadastre seus recebimentos e contas e acompanhe tudo em um só lugar.</p>
          </div>
        </div>

        <section className="cards">
          <div className="card income">
            <div className="icon"><ArrowUpCircle/></div>
            <span>Total recebidos</span>
            <strong>{money(received)}</strong>
          </div>
          <div className="card expense">
            <div className="icon"><ArrowDownCircle/></div>
            <span>Total contas</span>
            <strong>{money(bills)}</strong>
          </div>
          <div className="card balance">
            <div className="icon"><Wallet/></div>
            <span>Saldo</span>
            <strong>{money(balance)}</strong>
          </div>
        </section>

        <section className="allocation">
          <div className="section-title">
            <div>
              <span className="eyebrow">DIVISÃO DOS RECEBIMENTOS</span>
              <h2>Distribuição automática</h2>
            </div>
            <PiggyBank size={30}/>
          </div>
          <div className="allocation-grid">
            <div>
              <span>Contas — 50%</span>
              <strong>{money(allocationBills)}</strong>
              <div className="bar"><i style={{width: "50%"}}/></div>
            </div>
            <div>
              <span>Disponível — 50%</span>
              <strong>{money(remainingAllocation)}</strong>
              <div className="bar"><i style={{width: "50%"}}/></div>
            </div>
          </div>
        </section>

        <div className="content-grid">
          <section className="panel">
            <div className="section-title">
              <div>
                <span className="eyebrow">NOVO LANÇAMENTO</span>
                <h2>Adicionar movimentação</h2>
              </div>
              <Plus size={26}/>
            </div>

            <form onSubmit={addEntry}>
              <div className="type-switch">
                <button type="button" className={type === "entrada" ? "active in" : ""} onClick={() => setType("entrada")}>Recebido</button>
                <button type="button" className={type === "saida" ? "active out" : ""} onClick={() => setType("saida")}>Conta</button>
              </div>

              <label>Nome / descrição
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex.: Salário, aluguel, mercado..." />
              </label>

              <label>Valor
                <input inputMode="decimal" value={value} onChange={e => setValue(e.target.value)} placeholder="R$ 0,00" />
              </label>

              <label>Data
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </label>

              <button className="primary" type="submit"><Plus size={19}/> Adicionar</button>
            </form>
          </section>

          <section className="panel">
            <div className="section-title">
              <div>
                <span className="eyebrow">MOVIMENTAÇÕES</span>
                <h2>Histórico</h2>
              </div>
              <ReceiptText size={26}/>
            </div>

            {entries.length === 0 ? (
              <div className="empty">
                <ReceiptText size={42}/>
                <strong>Nenhum lançamento ainda</strong>
                <span>Adicione seu primeiro recebimento ou conta.</span>
              </div>
            ) : (
              <div className="list">
                {entries.map(item => (
                  <div className="entry" key={item.id}>
                    <div className={"entry-icon " + item.type}>
                      {item.type === "entrada" ? <ArrowUpCircle/> : <ArrowDownCircle/>}
                    </div>
                    <div className="entry-info">
                      <strong>{item.name}</strong>
                      <span><CalendarDays size={14}/> {new Date(item.date + "T12:00:00").toLocaleDateString("pt-BR")}</span>
                    </div>
                    <div className={"entry-value " + item.type}>
                      {item.type === "entrada" ? "+" : "-"} {money(item.value)}
                    </div>
                    <button className="delete" onClick={() => removeEntry(item.id)} title="Excluir">
                      <Trash2 size={17}/>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <footer>Gestão Familiar • Seus dados ficam armazenados neste dispositivo.</footer>
      </section>
    </main>
  );
}