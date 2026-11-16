




import { useEffect, useMemo, useState } from "react";
import { supabase } from "./utils/supabase";

type View = "home" | "search" | "store" | "product" | "cart" | "checkout" | "order";
type Role = "consumer" | "partner" | "courier" | "admin";

const photos = {
  market: "https://images.unsplash.com/photo-1654508590628-21c717998f6b?auto=format&fit=crop&w=1200&q=85",
  banana: "https://images.unsplash.com/photo-1668548205391-60358a614b54?auto=format&fit=crop&w=800&q=85",
  orange: "https://images.unsplash.com/photo-1613757667986-8b31df86e8d4?auto=format&fit=crop&w=800&q=85",
  apple: "https://images.unsplash.com/photo-1613757668274-4275abb83673?auto=format&fit=crop&w=800&q=85",
  pepper: "https://images.unsplash.com/photo-1669754839259-04d3abecfee6?auto=format&fit=crop&w=800&q=85",
  fair: "https://images.unsplash.com/photo-1668548205385-da1bdd1a0459?auto=format&fit=crop&w=1000&q=85",
};

const products = [
  { id: 1, name: "Banana pacovã", store: "Mercadinho São José", price: 8.9, unit: "Cacho aprox. 1 kg", image: photos.banana, available: true },
  { id: 2, name: "Laranja regional", store: "Mercadinho São José", price: 7.49, old: 9.9, unit: "Pacote 1 kg", image: photos.orange, available: true },
  { id: 3, name: "Maçã nacional", store: "Mercadinho São José", price: 12.9, unit: "Pacote 1 kg", image: photos.apple, available: true },
  { id: 4, name: "Pimentão colorido", store: "Mercadinho São José", price: 6.5, unit: "Bandeja 300 g", image: photos.pepper, available: false },
];

const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    cart: <><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20 8H7" /><circle cx="10" cy="20" r="1" /><circle cx="17" cy="20" r="1" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    receipt: <><path d="M6 3h12v19l-3-2-3 2-3-2-3 2V3Z" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    arrow: <path d="m9 18 6-6-6-6" />,
    back: <path d="m15 18-6-6 6-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    bike: <><circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" /><path d="m6 17 4-8h4l4 8M9 12h7M11 6h3" /></>,
    box: <><path d="m4 7 8-4 8 4-8 4-8-4Z" /><path d="M4 7v10l8 4 8-4V7M12 11v10" /></>,
    shop: <><path d="M4 10v11h16V10M3 4h18l-2 6H5L3 4Z" /><path d="M9 21v-6h6v6" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Logo({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-2.5">
    <div className="grid size-10 place-items-center rounded-xl bg-[#0B5C62] text-white shadow-sm"><Icon name="cart" size={22} /></div>
    {!compact && <div><div className="text-xl font-extrabold tracking-[-0.04em] text-[#123B3D]">Market<span className="text-[#F36C32]">Fast</span></div><div className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-500">Tudo em um só lugar</div></div>}
  </div>;
}

function Button({ children, onClick, variant = "primary", disabled = false, className = "", type = "button" }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost" | "danger"; disabled?: boolean; className?: string; type?: "button" | "submit" }) {
  const styles = { primary: "bg-[#F36C32] text-white hover:bg-[#D95722] shadow-sm", secondary: "bg-[#E4F1EF] text-[#0B5C62] hover:bg-[#D4E8E5]", ghost: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50", danger: "bg-red-50 text-red-700 hover:bg-red-100" };
  return <button type={type} onClick={onClick} disabled={disabled} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0B5C62] disabled:cursor-not-allowed disabled:opacity-45 ${styles[variant]} ${className}`}>{children}</button>;
}

function Header({ cartCount, onNavigate, onRoles }: { cartCount: number; onNavigate: (v: View) => void; onRoles: () => void }) {
  return <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-3 lg:px-8">
      <button onClick={() => onNavigate("home")} aria-label="Ir para o início"><Logo /></button>
      <button className="hidden min-w-52 items-center gap-2 rounded-xl p-2 text-left hover:bg-slate-50 md:flex">
        <Icon name="pin" size={19} /><span><span className="block text-[11px] font-semibold text-slate-500">Entregar em</span><span className="block text-sm font-bold text-slate-800">Centro — Tefé, AM</span></span><Icon name="arrow" size={16} />
      </button>
      <button onClick={() => onNavigate("search")} className="hidden h-11 flex-1 items-center gap-3 rounded-xl bg-slate-100 px-4 text-left text-sm text-slate-500 lg:flex"><Icon name="search" />Busque produtos, lojas ou categorias...</button>
      <nav aria-label="Ações da conta" className="ml-auto flex items-center gap-1">
        <button className="icon-button" aria-label="Notificações"><Icon name="bell" /></button>
        <button onClick={onRoles} className="icon-button" aria-label="Abrir áreas de demonstração"><Icon name="user" /></button>
        <button onClick={() => onNavigate("cart")} className="relative flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-slate-700 hover:bg-slate-100" aria-label={`Carrinho com ${cartCount} itens`}><Icon name="cart" /><span className="hidden sm:inline">Carrinho</span>{cartCount > 0 && <span className="absolute right-0 top-0 grid size-5 place-items-center rounded-full bg-[#F36C32] text-[11px] text-white">{cartCount}</span>}</button>
      </nav>
    </div>
  </header>;
}

function SearchBar({ onSearch }: { onSearch: () => void }) {
  return <form onSubmit={(e) => { e.preventDefault(); onSearch(); }} className="flex w-full items-center gap-3 rounded-2xl bg-white p-2 shadow-[0_8px_30px_rgba(15,45,47,.1)]">
    <Icon name="search" size={22} /><label htmlFor="main-search" className="sr-only">Buscar produtos, lojas ou categorias</label><input id="main-search" className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-slate-500" placeholder="Busque produtos, lojas ou categorias..." />
    <Button type="submit" className="hidden sm:inline-flex">Buscar</Button>
  </form>;
}

function Badge({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "orange" | "gray" | "red" | "blue" }) {
  const tones = { green: "bg-emerald-50 text-emerald-700", orange: "bg-orange-50 text-orange-700", gray: "bg-slate-100 text-slate-600", red: "bg-red-50 text-red-700", blue: "bg-sky-50 text-sky-700" };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${tones[tone]}`}>{children}</span>;
}

function ProductCard({ product, onAdd, onOpen }: { product: typeof products[number]; onAdd: (p: typeof products[number]) => void; onOpen: () => void }) {
  return <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
    <button onClick={onOpen} className="relative block w-full overflow-hidden bg-slate-100 text-left">
      <img src={product.image} alt={product.name} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
      {product.old && <span className="absolute left-3 top-3 rounded-full bg-[#123B3D] px-2.5 py-1 text-xs font-bold text-white">Oferta</span>}
      {!product.available && <span className="absolute inset-0 grid place-items-center bg-white/70 text-sm font-extrabold text-slate-700">Indisponível</span>}
    </button>
    <div className="p-4">
      <p className="text-xs font-medium text-slate-500">{product.store}</p>
      <button onClick={onOpen} className="mt-1 text-left font-bold text-slate-900 hover:text-[#0B5C62]">{product.name}</button>
      <p className="mt-1 text-xs text-slate-500">{product.unit}</p>
      <div className="mt-4 flex items-end justify-between gap-2">
        <div>{product.old && <div className="text-xs text-slate-400 line-through">{money(product.old)}</div>}<div className="text-lg font-extrabold text-[#123B3D]">{money(product.price)}</div></div>
        <button onClick={() => onAdd(product)} disabled={!product.available} className="grid size-11 place-items-center rounded-xl bg-[#F36C32] text-white transition hover:bg-[#D95722] disabled:bg-slate-200 disabled:text-slate-400" aria-label={`Adicionar ${product.name}`}><Icon name="plus" /></button>
      </div>
    </div>
  </article>;
}

function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return <div className="mb-5 flex items-end justify-between gap-3"><div>{eyebrow && <p className="mb-1 text-xs font-extrabold uppercase tracking-[.14em] text-[#F36C32]">{eyebrow}</p>}<h2 className="text-2xl font-extrabold tracking-[-0.03em] text-[#123B3D] md:text-3xl">{title}</h2></div>{action}</div>;
}

function Home({ navigate, add }: { navigate: (v: View) => void; add: (p: typeof products[number]) => void }) {
  const categories = [
    ["Restaurantes", "Garfo e sabor", "shop"], ["Supermercados", "Tudo para casa", "cart"], ["Farmácias", "Saúde e cuidado", "plus"], ["Feiras", "Frescos da região", "grid"], ["Variedades", "Encontre de tudo", "box"],
  ];
  return <main>
    <section className="relative overflow-hidden bg-[#E4F1EF]">
      <div className="absolute right-[-8%] top-[-40%] size-96 rounded-full bg-[#F7B267]/25" />
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-16">
        <div className="relative z-10">
          <Badge tone="green">Comércio local de Tefé</Badge>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] text-[#123B3D] md:text-5xl">O que você está procurando <span className="text-[#F36C32]">hoje?</span></h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">Produtos frescos, lojas da sua cidade e entrega simples. Tudo em um só lugar.</p>
          <div className="mt-7 max-w-2xl"><SearchBar onSearch={() => navigate("search")} /></div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-600"><span className="flex items-center gap-1.5"><Icon name="check" size={15} />Preços transparentes</span><span className="flex items-center gap-1.5"><Icon name="pin" size={15} />Entrega em Tefé</span></div>
        </div>
        <button onClick={() => navigate("store")} className="relative hidden overflow-hidden rounded-[2rem] text-left shadow-2xl lg:block">
          <img src={photos.market} alt="Banca com frutas e verduras frescas" className="h-80 w-full object-cover" />
          <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 p-4 backdrop-blur"><div className="flex items-center justify-between"><div><p className="font-extrabold text-[#123B3D]">Feira fresca, perto de você</p><p className="mt-0.5 text-sm text-slate-600">Compre do comércio local</p></div><span className="grid size-10 place-items-center rounded-full bg-[#F36C32] text-white"><Icon name="arrow" /></span></div></div>
        </button>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <SectionTitle title="Explore por categoria" action={<button onClick={() => navigate("search")} className="text-sm font-bold text-[#0B5C62]">Ver todas</button>} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map(([title, text, icon]) => <button key={title} onClick={() => navigate("search")} className="group rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-[#0B5C62] hover:shadow-md"><span className="grid size-11 place-items-center rounded-xl bg-[#E4F1EF] text-[#0B5C62] transition group-hover:bg-[#0B5C62] group-hover:text-white"><Icon name={icon} /></span><span className="mt-4 block font-extrabold text-slate-900">{title}</span><span className="mt-1 block text-xs text-slate-500">{text}</span></button>)}
      </div>
    </section>

    <section className="bg-[#FAF8F5] py-10">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionTitle eyebrow="Perto de você" title="Estabelecimentos em destaque" />
        <div className="grid gap-4 md:grid-cols-2">
          <button onClick={() => navigate("store")} className="group flex overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition hover:shadow-lg">
            <img src={photos.fair} alt="Mercadinho São José" className="h-48 w-36 object-cover sm:w-52" />
            <div className="flex flex-1 flex-col p-5"><div className="flex items-start justify-between gap-2"><Badge>Aberto</Badge><span className="text-xs font-bold text-slate-500">4,8</span></div><h3 className="mt-3 text-lg font-extrabold text-[#123B3D]">Mercadinho São José</h3><p className="mt-1 text-sm text-slate-500">Supermercado • Centro</p><p className="mt-auto flex items-center gap-1.5 pt-3 text-xs font-semibold text-slate-600"><Icon name="clock" size={16} />Aberto até 20h • 25–35 min</p></div>
          </button>
          <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white opacity-75">
            <img src={photos.orange} alt="Feira do Produtor" className="h-48 w-36 object-cover sm:w-52" />
            <div className="flex flex-1 flex-col p-5"><Badge tone="gray">Fechado</Badge><h3 className="mt-3 text-lg font-extrabold text-[#123B3D]">Feira do Produtor</h3><p className="mt-1 text-sm text-slate-500">Feira • Juruá</p><p className="mt-auto pt-3 text-xs font-semibold text-slate-500">Abre amanhã às 6h • Pedidos indisponíveis</p></div>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <SectionTitle eyebrow="Escolhas da semana" title="Produtos em destaque" action={<button onClick={() => navigate("search")} className="text-sm font-bold text-[#0B5C62]">Ver todos</button>} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{products.map((p) => <ProductCard key={p.id} product={p} onAdd={add} onOpen={() => navigate("product")} />)}</div>
    </section>
  </main>;
}

function SearchPage({ navigate, add }: { navigate: (v: View) => void; add: (p: typeof products[number]) => void }) {
  const [available, setAvailable] = useState(false);
  return <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
    <button onClick={() => navigate("home")} className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#0B5C62]"><Icon name="back" />Voltar ao início</button>
    <h1 className="text-3xl font-extrabold tracking-tight text-[#123B3D]">Encontre o que precisa</h1>
    <div className="mt-5 max-w-3xl"><SearchBar onSearch={() => {}} /></div>
    <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-5">
      <button className="filter active">Todos</button><button className="filter">Produtos</button><button className="filter">Estabelecimentos</button>
      <span className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />
      <button onClick={() => setAvailable(!available)} className={`filter ${available ? "active" : ""}`}>Disponíveis agora</button><button className="filter">Preço</button><button className="filter">Ordenar</button>
    </div>
    <div className="mt-7 flex items-center justify-between"><p className="text-sm text-slate-600"><strong className="text-slate-900">{available ? "3" : "4"} resultados</strong> perto de você</p><p className="hidden text-xs text-slate-500 sm:block">Valores demonstrativos</p></div>
    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{products.filter((p) => !available || p.available).map((p) => <ProductCard key={p.id} product={p} onAdd={add} onOpen={() => navigate("product")} />)}</div>
  </main>;
}

function StorePage({ navigate, add }: { navigate: (v: View) => void; add: (p: typeof products[number]) => void }) {
  return <main>
    <div className="relative h-56 overflow-hidden bg-slate-200 md:h-72"><img src={photos.fair} alt="Produtos do Mercadinho São José" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#123B3D]/75 to-transparent" /><button onClick={() => navigate("home")} className="absolute left-4 top-4 grid size-11 place-items-center rounded-full bg-white text-slate-800 shadow"><Icon name="back" /></button></div>
    <div className="mx-auto max-w-7xl px-4 lg:px-8">
      <section className="relative -mt-12 rounded-3xl border border-slate-200 bg-white p-5 shadow-lg md:p-7">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><Badge>Aberto • até 20h</Badge><h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#123B3D]">Mercadinho São José</h1><p className="mt-2 text-sm text-slate-600">Supermercado • Rua Monteiro de Souza, Centro, Tefé</p></div><div className="flex flex-wrap gap-3 text-sm font-semibold text-slate-600"><span className="flex items-center gap-2"><Icon name="bike" />Entrega em 25–35 min</span><span className="flex items-center gap-2"><Icon name="card" />Pix, cartão e presencial</span></div></div>
      </section>
      <div className="py-10"><SectionTitle title="Catálogo" /><div className="mb-6 flex max-w-xl items-center gap-3 rounded-xl bg-slate-100 px-4 py-3"><Icon name="search" /><input aria-label="Buscar neste catálogo" className="w-full bg-transparent text-sm outline-none" placeholder="Buscar neste estabelecimento" /></div><div className="mb-6 flex gap-2 overflow-auto pb-1"><button className="filter active">Todos</button><button className="filter">Hortifruti</button><button className="filter">Mercearia</button><button className="filter">Bebidas</button></div><div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{products.map((p) => <ProductCard key={p.id} product={p} onAdd={add} onOpen={() => navigate("product")} />)}</div></div>
    </div>
  </main>;
}

function ProductPage({ navigate, add }: { navigate: (v: View) => void; add: (p: typeof products[number]) => void }) {
  const [qty, setQty] = useState(1);
  const product = products[1];
  return <main className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-10">
    <button onClick={() => navigate("store")} className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-600"><Icon name="back" />Voltar ao catálogo</button>
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
      <div className="overflow-hidden rounded-3xl bg-slate-100"><img src={product.image} alt={product.name} className="aspect-square w-full object-cover" /></div>
      <div className="flex flex-col justify-center">
        <button onClick={() => navigate("store")} className="w-fit text-sm font-bold text-[#0B5C62]">{product.store}</button><Badge tone="green">Disponível</Badge>
        <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-[#123B3D]">{product.name}</h1><p className="mt-3 leading-7 text-slate-600">Frutas selecionadas, frescas e prontas para chegar à sua casa. Produto vendido em pacote de aproximadamente 1 kg.</p>
        <div className="mt-5 flex items-baseline gap-3"><span className="text-3xl font-extrabold text-[#123B3D]">{money(product.price)}</span><span className="text-sm text-slate-400 line-through">{money(product.old!)}</span></div>
        <div className="mt-7"><label className="text-sm font-bold text-slate-800">Quantidade</label><div className="mt-2 flex w-fit items-center rounded-xl border border-slate-200"><button onClick={() => setQty(Math.max(1, qty - 1))} className="grid size-11 place-items-center" aria-label="Diminuir quantidade"><Icon name="minus" /></button><span className="w-11 text-center font-bold">{qty}</span><button onClick={() => setQty(qty + 1)} className="grid size-11 place-items-center" aria-label="Aumentar quantidade"><Icon name="plus" /></button></div></div>
        <label htmlFor="note" className="mt-6 text-sm font-bold text-slate-800">Observação <span className="font-normal text-slate-400">(opcional)</span></label><textarea id="note" className="mt-2 rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-[#0B5C62]" rows={3} placeholder="Ex.: prefiro frutas mais maduras" />
        <Button onClick={() => { for (let i = 0; i < qty; i++) add(product); }} className="mt-6 w-full py-3.5"><Icon name="cart" />Adicionar {qty} ao carrinho • {money(product.price * qty)}</Button>
      </div>
    </div>
  </main>;
}

function CartPage({ navigate, cart, setCart }: { navigate: (v: View) => void; cart: Record<number, number>; setCart: React.Dispatch<React.SetStateAction<Record<number, number>>> }) {
  const items = products.filter((p) => cart[p.id]);
  const subtotal = items.reduce((sum, p) => sum + p.price * cart[p.id], 0);
  const update = (id: number, change: number) => setCart((old) => ({ ...old, [id]: Math.max(0, (old[id] || 0) + change) }));
  if (!items.length) return <main className="mx-auto grid min-h-[65vh] max-w-xl place-items-center px-4 text-center"><div><span className="mx-auto grid size-20 place-items-center rounded-full bg-[#E4F1EF] text-[#0B5C62]"><Icon name="cart" size={34} /></span><h1 className="mt-5 text-2xl font-extrabold text-[#123B3D]">Seu carrinho está vazio</h1><p className="mt-2 text-slate-600">Explore as lojas de Tefé e encontre algo especial.</p><Button onClick={() => navigate("home")} className="mt-6">Explorar produtos</Button></div></main>;
  return <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
    <button onClick={() => navigate("store")} className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-600"><Icon name="back" />Continuar comprando</button><h1 className="text-3xl font-extrabold text-[#123B3D]">Seu carrinho</h1><p className="mt-1 text-sm text-slate-500">Itens de Mercadinho São José</p>
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-3">{items.map((p) => <article key={p.id} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"><img src={p.image} alt={p.name} className="size-24 rounded-xl object-cover sm:size-28" /><div className="min-w-0 flex-1"><h2 className="font-extrabold text-slate-900">{p.name}</h2><p className="mt-1 text-xs text-slate-500">{p.unit}</p><p className="mt-2 font-bold text-[#123B3D]">{money(p.price)}</p><div className="mt-3 flex items-center justify-between"><div className="flex items-center rounded-xl border border-slate-200"><button onClick={() => update(p.id, -1)} className="grid size-10 place-items-center" aria-label="Diminuir"><Icon name="minus" /></button><span className="w-8 text-center text-sm font-bold">{cart[p.id]}</span><button onClick={() => update(p.id, 1)} className="grid size-10 place-items-center" aria-label="Aumentar"><Icon name="plus" /></button></div><button onClick={() => setCart((old) => ({ ...old, [p.id]: 0 }))} className="icon-button text-red-600" aria-label={`Remover ${p.name}`}><Icon name="trash" /></button></div></div><p className="hidden font-extrabold sm:block">{money(p.price * cart[p.id])}</p></article>)}</div>
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-24"><h2 className="text-lg font-extrabold text-[#123B3D]">Resumo</h2><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="flex justify-between text-slate-600"><span>Taxa de entrega</span><span>{money(7)}</span></div><div className="border-t border-slate-200 pt-4"><div className="flex justify-between text-lg font-extrabold text-[#123B3D]"><span>Total</span><span>{money(subtotal + 7)}</span></div><p className="mt-1 text-xs text-slate-500">Preço registrado ao confirmar o pedido.</p></div></div><Button onClick={() => navigate("checkout")} className="mt-6 w-full">Continuar para entrega <Icon name="arrow" /></Button><p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500"><Icon name="lock" size={14} />Compra segura e transparente</p></aside>
    </div>
  </main>;
}

function Checkout({ navigate, total }: { navigate: (v: View) => void; total: number }) {
  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState("pix");
  const [address, setAddress] = useState("center");
  const labels = ["Endereço", "Pagamento", "Revisão"];
  return <main className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
    <button onClick={() => step > 1 ? setStep(step - 1) : navigate("cart")} className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-600"><Icon name="back" />Voltar</button>
    <div className="mb-8 flex items-center">{labels.map((label, i) => <div key={label} className="flex flex-1 items-center last:flex-none"><div className="flex items-center gap-2"><span className={`grid size-8 place-items-center rounded-full text-sm font-extrabold ${step > i + 1 ? "bg-emerald-600 text-white" : step === i + 1 ? "bg-[#0B5C62] text-white" : "bg-slate-200 text-slate-500"}`}>{step > i + 1 ? <Icon name="check" size={16} /> : i + 1}</span><span className={`hidden text-sm font-bold sm:inline ${step === i + 1 ? "text-[#123B3D]" : "text-slate-500"}`}>{label}</span></div>{i < 2 && <span className="mx-3 h-px flex-1 bg-slate-200" />}</div>)}</div>
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section>
        {step === 1 && <><h1 className="text-3xl font-extrabold text-[#123B3D]">Onde vamos entregar?</h1><p className="mt-2 text-slate-600">Escolha um endereço dentro da área atendida.</p><div className="mt-6 space-y-3"><label className={`block cursor-pointer rounded-2xl border-2 p-5 ${address === "center" ? "border-[#0B5C62] bg-[#E4F1EF]/40" : "border-slate-200"}`}><input type="radio" name="address" className="sr-only" checked={address === "center"} onChange={() => setAddress("center")} /><div className="flex justify-between gap-3"><div><p className="font-extrabold">Casa</p><p className="mt-1 text-sm text-slate-600">Rua Monteiro de Souza, 135 • Centro</p><p className="mt-1 text-xs text-slate-500">Próximo à praça principal — Tefé, AM</p></div><span className="text-[#0B5C62]"><Icon name="pin" /></span></div></label><label className={`block cursor-pointer rounded-2xl border-2 p-5 ${address === "outside" ? "border-red-400 bg-red-50" : "border-slate-200"}`}><input type="radio" name="address" className="sr-only" checked={address === "outside"} onChange={() => setAddress("outside")} /><p className="font-extrabold">Sítio da família</p><p className="mt-1 text-sm text-slate-600">Comunidade distante, região fluvial</p>{address === "outside" && <p role="alert" className="mt-3 rounded-xl bg-white p-3 text-sm font-semibold text-red-700">Este endereço está fora da área de entrega. No momento, o MarketFast atende somente a área urbana de Tefé, sem entregas fluviais.</p>}</label><Button variant="ghost" className="w-full"><Icon name="plus" />Cadastrar outro endereço</Button></div></>}
        {step === 2 && <><h1 className="text-3xl font-extrabold text-[#123B3D]">Como deseja pagar?</h1><p className="mt-2 text-slate-600">Mostramos apenas as formas aceitas pelo estabelecimento.</p><div className="mt-6 grid gap-3">{[["pix", "Pix", "Aprovação necessária antes do envio"], ["card", "Cartão", "Pagamento on-line em ambiente seguro"], ["door", "Na entrega", "Pague presencialmente ao receber"]].map(([id, title, text]) => <label key={id} className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-5 ${payment === id ? "border-[#0B5C62] bg-[#E4F1EF]/40" : "border-slate-200"}`}><input type="radio" name="payment" className="sr-only" checked={payment === id} onChange={() => setPayment(id)} /><span className="grid size-11 place-items-center rounded-xl bg-white text-[#0B5C62]"><Icon name={id === "pix" ? "grid" : "card"} /></span><span><span className="block font-extrabold">{title}</span><span className="mt-0.5 block text-sm text-slate-500">{text}</span></span></label>)}</div><div className="mt-5 rounded-xl bg-sky-50 p-4 text-sm text-sky-800"><strong>Ambiente demonstrativo.</strong> Nenhum pagamento real será processado nesta experiência.</div></>}
        {step === 3 && <><h1 className="text-3xl font-extrabold text-[#123B3D]">Revise seu pedido</h1><p className="mt-2 text-slate-600">Confira tudo antes de confirmar.</p><div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5"><div className="py-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Estabelecimento</p><p className="mt-1 font-extrabold">Mercadinho São José</p></div><div className="py-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Entrega</p><p className="mt-1 font-semibold">Rua Monteiro de Souza, 135 • Centro</p><button onClick={() => setStep(1)} className="mt-2 text-sm font-bold text-[#0B5C62]">Editar endereço</button></div><div className="py-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pagamento</p><p className="mt-1 font-semibold">{payment === "pix" ? "Pix" : payment === "card" ? "Cartão" : "Pagamento presencial"}</p><button onClick={() => setStep(2)} className="mt-2 text-sm font-bold text-[#0B5C62]">Editar pagamento</button></div></div></>}
      </section>
      <aside className="h-fit rounded-2xl bg-[#123B3D] p-6 text-white"><p className="text-sm font-bold text-white/70">Total do pedido</p><p className="mt-1 text-3xl font-extrabold">{money(total)}</p><p className="mt-3 text-xs leading-5 text-white/65">Inclui produtos e taxa de entrega. Não há cobranças ocultas.</p>{step < 3 ? <Button onClick={() => setStep(step + 1)} disabled={step === 1 && address === "outside"} className="mt-6 w-full">Continuar <Icon name="arrow" /></Button> : <Button onClick={() => navigate("order")} className="mt-6 w-full"><Icon name="check" />Confirmar pedido</Button>}</aside>
    </div>
  </main>;
}

function OrderPage({ navigate }: { navigate: (v: View) => void }) {
  const stages = ["Confirmado", "Em preparo", "Pronto", "Em entrega", "Concluído"];
  return <main className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
    <div className="rounded-3xl bg-[#E4F1EF] p-6 md:p-8"><Badge tone="green">Pedido confirmado</Badge><h1 className="mt-3 text-3xl font-extrabold text-[#123B3D]">Pedido #MF-2048</h1><p className="mt-2 text-slate-600">O Mercadinho São José recebeu seu pedido. Previsão de entrega: <strong>45–55 min</strong>.</p></div>
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 md:p-8"><h2 className="text-xl font-extrabold text-[#123B3D]">Acompanhe seu pedido</h2><div className="mt-8 grid gap-0 sm:grid-cols-5">{stages.map((s, i) => <div key={s} className="relative flex gap-4 pb-7 sm:block sm:pb-0 sm:text-center"><span className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full ${i === 0 ? "bg-[#0B5C62] text-white ring-4 ring-[#E4F1EF]" : "bg-slate-100 text-slate-400"}`}>{i === 0 ? <Icon name="check" size={18} /> : i + 1}</span>{i < stages.length - 1 && <span className="absolute left-5 top-10 h-[calc(100%-2.5rem)] w-px bg-slate-200 sm:left-[calc(50%+1.25rem)] sm:top-5 sm:h-px sm:w-[calc(100%-2.5rem)]" />}<div className="sm:mt-3"><p className={`text-sm font-extrabold ${i === 0 ? "text-[#0B5C62]" : "text-slate-500"}`}>{s}</p>{i === 0 && <p className="mt-1 text-xs text-slate-500">10h42</p>}</div></div>)}</div></section>
    <div className="mt-6 grid gap-4 md:grid-cols-2"><section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="font-extrabold text-[#123B3D]">Detalhes da entrega</h2><p className="mt-4 text-sm font-semibold">Rua Monteiro de Souza, 135</p><p className="mt-1 text-sm text-slate-500">Centro • Tefé, AM</p><p className="mt-4 text-sm text-slate-600">Pagamento: Pix <Badge tone="green">Aprovado — demonstração</Badge></p></section><section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="font-extrabold text-[#123B3D]">Resumo</h2><p className="mt-4 text-sm text-slate-600">3 itens • Mercadinho São José</p><p className="mt-2 text-xl font-extrabold text-[#123B3D]">{money(35.29)}</p><Button variant="danger" className="mt-5 w-full">Cancelar pedido</Button><p className="mt-2 text-center text-xs text-slate-500">Disponível somente enquanto o status for Confirmado.</p></section></div>
    <Button variant="ghost" onClick={() => navigate("home")} className="mt-6">Voltar ao início</Button>
  </main>;
}

function Sidebar({ role, setRole, active, setActive }: { role: Role; setRole: (r: Role) => void; active: string; setActive: (v: string) => void }) {
  const nav = role === "partner" ? ["Visão geral", "Pedidos", "Produtos", "Categorias", "Dados da loja", "Horários", "Regiões", "Pagamentos"] : role === "admin" ? ["Visão geral", "Estabelecimentos", "Entregadores", "Pedidos", "Categorias"] : ["Solicitações", "Em andamento", "Histórico"];
  return <aside className="border-r border-slate-200 bg-[#123B3D] p-4 text-white lg:min-h-screen lg:w-64 lg:p-6"><Logo /><div className="mt-7 flex gap-2 overflow-auto lg:block lg:space-y-1">{nav.map((n) => <button key={n} onClick={() => setActive(n)} className={`flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-bold lg:w-full ${active === n ? "bg-white text-[#123B3D]" : "text-white/70 hover:bg-white/10 hover:text-white"}`}><Icon name={n === "Produtos" ? "box" : n === "Pedidos" ? "receipt" : "grid"} />{n}</button>)}</div><button onClick={() => setRole("consumer")} className="mt-6 flex min-h-11 w-full items-center gap-2 rounded-xl border border-white/20 px-3 text-sm font-bold text-white/80 hover:bg-white/10"><Icon name="back" />Voltar à loja</button></aside>;
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-2 text-3xl font-extrabold tracking-tight text-[#123B3D]">{value}</p><p className="mt-2 text-xs font-semibold text-emerald-700">{note}</p></div>;
}

function PartnerDashboard({ role, setRole }: { role: Role; setRole: (r: Role) => void }) {
  const [active, setActive] = useState("Visão geral");
  const [orderStatus, setOrderStatus] = useState("Aguardando decisão");
  return <div className="min-h-screen bg-slate-50 lg:flex"><Sidebar role={role} setRole={setRole} active={active} setActive={setActive} /><main className="flex-1 p-4 md:p-8"><div className="flex items-center justify-between"><div><p className="text-sm font-bold text-[#F36C32]">Mercadinho São José</p><h1 className="mt-1 text-3xl font-extrabold text-[#123B3D]">{active}</h1></div><Badge tone="blue">Dados demonstrativos</Badge></div>
    {active === "Visão geral" && <><div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Pedidos hoje" value="18" note="+4 desde ontem" /><Metric label="Aguardando decisão" value="3" note="Ação necessária" /><Metric label="Em preparo" value="5" note="Dentro do prazo" /><Metric label="Produtos indisponíveis" value="7" note="De 84 cadastrados" /></div><section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><h2 className="text-lg font-extrabold text-[#123B3D]">Pedidos recentes</h2><Button variant="secondary" onClick={() => setActive("Pedidos")}>Ver pedidos</Button></div><OrderTable status={orderStatus} setStatus={setOrderStatus} /></section></>}
    {active === "Pedidos" && <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5"><div className="flex flex-wrap justify-between gap-3"><h2 className="text-lg font-extrabold">Pedidos recebidos</h2><div className="flex gap-2"><button className="filter active">Todos</button><button className="filter">Aguardando</button><button className="filter">Em preparo</button></div></div><OrderTable status={orderStatus} setStatus={setOrderStatus} /></section>}
    {active === "Produtos" && <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><h2 className="text-lg font-extrabold">84 produtos</h2><Button><Icon name="plus" />Novo produto</Button></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500"><tr><th className="py-3">Produto</th><th>Categoria</th><th>Preço</th><th>Disponibilidade</th><th>Ação</th></tr></thead><tbody>{products.map((p) => <tr key={p.id} className="border-b border-slate-100"><td className="py-3"><div className="flex items-center gap-3"><img src={p.image} alt="" className="size-11 rounded-lg object-cover" /><strong>{p.name}</strong></div></td><td>Hortifruti</td><td>{money(p.price)}</td><td><Badge tone={p.available ? "green" : "gray"}>{p.available ? "Disponível" : "Indisponível"}</Badge></td><td><button className="font-bold text-[#0B5C62]">Editar</button></td></tr>)}</tbody></table></div></section>}
    {!["Visão geral", "Pedidos", "Produtos"].includes(active) && <EmptyOperational title={`${active} do estabelecimento`} />}
  </main></div>;
}

function OrderTable({ status, setStatus }: { status: string; setStatus: (s: string) => void }) {
  return <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500"><tr><th className="py-3">Pedido</th><th>Horário</th><th>Cliente</th><th>Total</th><th>Status</th><th>Ação</th></tr></thead><tbody><tr><td className="py-4 font-extrabold">#MF-2048</td><td>10h42</td><td>Marina Alves</td><td className="font-bold">{money(35.29)}</td><td><Badge tone={status === "Aguardando decisão" ? "orange" : "green"}>{status}</Badge></td><td>{status === "Aguardando decisão" ? <button onClick={() => setStatus("Em preparo • 30 min")} className="font-bold text-[#0B5C62]">Aceitar</button> : <button onClick={() => setStatus("Pronto")} className="font-bold text-[#0B5C62]">Marcar pronto</button>}</td></tr><tr><td className="py-4 font-extrabold">#MF-2047</td><td>10h35</td><td>Carlos Souza</td><td className="font-bold">{money(58.8)}</td><td><Badge tone="green">Em preparo • 25 min</Badge></td><td><button className="font-bold text-[#0B5C62]">Ver detalhes</button></td></tr></tbody></table></div>;
}

function EmptyOperational({ title }: { title: string }) { return <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"><span className="mx-auto grid size-14 place-items-center rounded-full bg-slate-100 text-slate-500"><Icon name="grid" /></span><h2 className="mt-4 text-lg font-extrabold">{title}</h2><p className="mt-2 text-sm text-slate-500">Área preparada para os dados operacionais do estabelecimento.</p></div>; }

function CourierDashboard({ setRole }: { setRole: (r: Role) => void }) {
  const [active, setActive] = useState("Solicitações");
  const [accepted, setAccepted] = useState(false);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  return <div className="min-h-screen bg-slate-50 lg:flex"><Sidebar role="courier" setRole={setRole} active={active} setActive={setActive} /><main className="mx-auto w-full max-w-3xl flex-1 p-4 md:p-8"><Badge tone="blue">Entregador aprovado • demonstração</Badge><h1 className="mt-3 text-3xl font-extrabold text-[#123B3D]">{accepted ? "Entrega em andamento" : active}</h1>
    {!accepted ? <article className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white"><div className="bg-[#E4F1EF] p-5"><div className="flex items-center justify-between"><Badge>Pedido pronto</Badge><span className="font-extrabold text-[#123B3D]">#MF-2046</span></div><h2 className="mt-4 text-xl font-extrabold text-[#123B3D]">Mercadinho São José</h2><p className="mt-1 text-sm text-slate-600">Coleta no Centro • entrega no Juruá</p></div><div className="p-5"><div className="grid grid-cols-2 gap-4"><div><p className="text-xs text-slate-500">Distância estimada</p><p className="mt-1 font-extrabold">3,2 km</p></div><div><p className="text-xs text-slate-500">Valor da entrega</p><p className="mt-1 font-extrabold">{money(7)}</p></div></div><div className="mt-5 rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-800">A solicitação será atribuída ao primeiro entregador que aceitar.</div><Button onClick={() => setAccepted(true)} className="mt-5 w-full">Aceitar entrega</Button></div></article> :
    <><div className="mt-6 rounded-2xl bg-[#123B3D] p-5 text-white"><p className="text-xs font-bold uppercase tracking-wider text-white/60">Status atual</p><p className="mt-1 text-xl font-extrabold">Em entrega</p><p className="mt-2 text-sm text-white/70">Siga para Rua Monteiro de Souza, 135 • Centro</p></div><section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-extrabold text-[#123B3D]">Confirmar entrega</h2><p className="mt-2 text-sm text-slate-600">Peça ao consumidor o código de 4 dígitos. A entrega só será concluída com um código válido.</p><label htmlFor="code" className="mt-5 block text-sm font-bold">Código de confirmação</label><input id="code" inputMode="numeric" maxLength={4} value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setMessage(""); }} className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-center text-2xl font-extrabold tracking-[.5em] outline-none focus:border-[#0B5C62]" placeholder="••••" /><Button onClick={() => setMessage(code === "2048" ? "Entrega concluída com sucesso." : "Código inválido. Confira com o consumidor e tente novamente.")} className="mt-4 w-full" disabled={code.length !== 4}>Concluir entrega</Button>{message && <p role="alert" className={`mt-3 rounded-xl p-3 text-sm font-bold ${message.includes("sucesso") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{message}</p>}<p className="mt-3 text-center text-xs text-slate-400">Código demonstrativo: 2048</p></section></>}
  </main></div>;
}

function AdminDashboard({ setRole }: { setRole: (r: Role) => void }) {
  const [active, setActive] = useState("Visão geral");
  const [approved, setApproved] = useState(false);
  return <div className="min-h-screen bg-slate-50 lg:flex"><Sidebar role="admin" setRole={setRole} active={active} setActive={setActive} /><main className="flex-1 p-4 md:p-8"><Badge tone="blue">Gestão • dados demonstrativos</Badge><h1 className="mt-3 text-3xl font-extrabold text-[#123B3D]">{active}</h1>
    {active === "Visão geral" && <><div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Pedidos no mês" value="1.284" note="+12% no período" /><Metric label="Vendas registradas" value="R$ 48,6 mil" note="Valores demonstrativos" /><Metric label="Estabelecimentos ativos" value="36" note="4 aguardam aprovação" /><Metric label="Entregadores ativos" value="58" note="7 aguardam análise" /></div><section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5"><h2 className="text-lg font-extrabold">Pendências prioritárias</h2><div className="mt-5 flex flex-col gap-3 rounded-xl bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-extrabold text-amber-900">4 estabelecimentos aguardam aprovação</p><p className="mt-1 text-sm text-amber-700">Revise os dados antes que apareçam para consumidores.</p></div><Button variant="ghost" onClick={() => setActive("Estabelecimentos")}>Analisar cadastros</Button></div></section></>}
    {active === "Estabelecimentos" && <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><h2 className="text-lg font-extrabold">Estabelecimentos</h2><button className="filter"><Icon name="search" size={16} />Pesquisar</button></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500"><tr><th className="py-3">Estabelecimento</th><th>Categoria</th><th>Endereço</th><th>Status</th><th>Ação</th></tr></thead><tbody><tr><td className="py-4 font-extrabold">Casa do Norte Tefé</td><td>Variedades</td><td>Centro, Tefé</td><td><Badge tone={approved ? "green" : "orange"}>{approved ? "Aprovado" : "Em análise"}</Badge></td><td>{approved ? <button className="font-bold text-slate-500">Ver cadastro</button> : <div className="flex gap-3"><button onClick={() => setApproved(true)} className="font-bold text-emerald-700">Aprovar</button><button className="font-bold text-red-700">Recusar</button></div>}</td></tr><tr><td className="py-4 font-extrabold">Mercadinho São José</td><td>Supermercado</td><td>Centro, Tefé</td><td><Badge>Ativo</Badge></td><td><button className="font-bold text-[#0B5C62]">Gerenciar</button></td></tr></tbody></table></div></section>}
    {!["Visão geral", "Estabelecimentos"].includes(active) && <EmptyOperational title={`Gestão de ${active.toLowerCase()}`} />}
  </main></div>;
}

function RoleModal({ close, select }: { close: () => void; select: (r: Role) => void }) {
  const roles: [Role, string, string, string][] = [["consumer", "Consumidor", "Comprar e acompanhar pedidos", "cart"], ["partner", "Parceiro comercial", "Gerenciar produtos e pedidos", "shop"], ["courier", "Entregador", "Aceitar e concluir entregas", "bike"], ["admin", "Gestor", "Aprovar cadastros e acompanhar operação", "grid"]];
  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#123B3D]/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="role-title" onMouseDown={close}><div onMouseDown={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-extrabold uppercase tracking-wider text-[#F36C32]">Ambiente demonstrativo</p><h2 id="role-title" className="mt-1 text-2xl font-extrabold text-[#123B3D]">Escolha uma experiência</h2><p className="mt-2 text-sm text-slate-500">Cada perfil possui navegação e permissões separadas.</p></div><button onClick={close} className="icon-button" aria-label="Fechar">×</button></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{roles.map(([id, title, text, icon]) => <button key={id} onClick={() => select(id)} className="rounded-2xl border border-slate-200 p-4 text-left transition hover:border-[#0B5C62] hover:bg-[#E4F1EF]/50"><span className="grid size-10 place-items-center rounded-xl bg-[#E4F1EF] text-[#0B5C62]"><Icon name={icon} /></span><span className="mt-3 block font-extrabold text-slate-900">{title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{text}</span></button>)}</div></div></div>;
}

function MobileNav({ view, navigate, cartCount }: { view: View; navigate: (v: View) => void; cartCount: number }) {
  return <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-slate-200 bg-white px-2 pb-[env(safe-area-inset-bottom)] lg:hidden" aria-label="Navegação principal"><button onClick={() => navigate("home")} className={`mobile-nav ${view === "home" ? "active" : ""}`}><Icon name="home" /><span>Início</span></button><button onClick={() => navigate("search")} className={`mobile-nav ${view === "search" ? "active" : ""}`}><Icon name="search" /><span>Buscar</span></button><button onClick={() => navigate("order")} className={`mobile-nav ${view === "order" ? "active" : ""}`}><Icon name="receipt" /><span>Pedidos</span></button><button onClick={() => navigate("cart")} className={`mobile-nav relative ${view === "cart" ? "active" : ""}`}><Icon name="cart" /><span>Carrinho {cartCount ? `(${cartCount})` : ""}</span></button></nav>;
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [role, setRole] = useState<Role>("consumer");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [toast, setToast] = useState("");
  const [rolesOpen, setRolesOpen] = useState(false);

  // Testa a conexão com o Supabase
  useEffect(() => {
    async function testarSupabase() {
      const { data, error } = await supabase
        .from("produtos")
        .select("*");

      if (error) {
        console.error("Erro no Supabase:", error);
      } else {
        console.log("SUPABASE CONECTADO!", data);
      }
    }

    testarSupabase();
  }, []);


  const cartCount = Object.values(cart).reduce(
    (a, b) => a + b,
    0
  );

  const total = useMemo(
    () =>
      products.reduce(
        (sum, p) => sum + (cart[p.id] || 0) * p.price,
        0
      ) + 7,
    [cart]
  );

  const navigate = (v: View) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const add = (p: typeof products[number]) => {
    if (!p.available) return;

    setCart((old) => ({
      ...old,
      [p.id]: (old[p.id] || 0) + 1,
    }));

    setToast(`${p.name} foi adicionado ao carrinho`);
    window.setTimeout(() => setToast(""), 2500);
  };

  const chooseRole = (r: Role) => {
    setRole(r);
    setRolesOpen(false);
  };

  if (role === "partner") {
    return <PartnerDashboard role={role} setRole={setRole} />;
  }

  if (role === "courier") {
    return <CourierDashboard setRole={setRole} />;
  }

  if (role === "admin") {
    return <AdminDashboard setRole={setRole} />;
  }

  return (
    <div className="min-h-screen bg-white pb-20 text-slate-800 lg:pb-0">
      <Header
        cartCount={cartCount}
        onNavigate={navigate}
        onRoles={() => setRolesOpen(true)}
      />

      {view === "home" && <Home navigate={navigate} add={add} />}
      {view === "search" && <SearchPage navigate={navigate} add={add} />}
      {view === "store" && <StorePage navigate={navigate} add={add} />}
      {view === "product" && <ProductPage navigate={navigate} add={add} />}
      {view === "cart" && (
        <CartPage navigate={navigate} cart={cart} setCart={setCart} />
      )}
      {view === "checkout" && <Checkout navigate={navigate} total={total} />}
      {view === "order" && <OrderPage navigate={navigate} />}

      <MobileNav
        view={view}
        navigate={navigate}
        cartCount={cartCount}
      />

      {toast && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-[#123B3D] px-4 py-3 text-sm font-bold text-white shadow-xl lg:bottom-6"
        >
          <span className="grid size-6 place-items-center rounded-full bg-emerald-500">
            <Icon name="check" size={15} />
          </span>
          {toast}
        </div>
      )}

      {rolesOpen && (
        <RoleModal
          close={() => setRolesOpen(false)}
          select={chooseRole}
        />
      )}
    </div>
  );
}


