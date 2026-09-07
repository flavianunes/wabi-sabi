# @wabi-sabi/ui

Documento de planejamento. v5.

> **Regra de idioma.** Este documento de planejamento está em português porque é material interno. **Todo artefato do projeto é em inglês:** código, comentários, nomes de variáveis, README, `AGENTS.md`, documentação MDX, mensagens de commit, changesets, descrições de PR e mensagens de erro. Sem exceção.

---

## Parte 1: O projeto

### Nome

Pacote: `@wabi-sabi/ui`. Repositório: `wabi-sabi`.

O scope `wabi-sabi` e o pacote `@wabi-sabi/ui` estão livres no npm. Existe um `wabi-sabi-ui` publicado em 2022, mas é um placeholder sem nenhuma versão e sem repositório, então não há conflito real de nome nem de busca.

### Descrição curta

Biblioteca de componentes React construída sobre Base UI e Motion, com a transição entre estados tratada como parte da API e não como enfeite adicionado depois.

### O que é

Um conjunto pequeno de componentes React acessíveis e estilizados. A camada de comportamento e acessibilidade vem do Base UI. A camada de movimento vem do Motion. O que a `@wabi-sabi/ui` adiciona é a opinião: um sistema de tokens enxuto, uma linguagem de movimento consistente e uma superfície de API deliberadamente pequena.

Não é um framework de UI completo. É uma biblioteca com escopo definido, que prefere fazer poucas coisas bem acabadas.

### O problema

Bibliotecas headless resolvem comportamento e acessibilidade, mas deixam estilo e movimento por conta de quem consome. O resultado comum é que a animação vira a última coisa a ser feita, é implementada componente a componente sem coerência, e quebra nos casos difíceis: quando o usuário fecha antes da entrada terminar, quando o elemento precisa continuar montado para poder sair, quando alguém ativou `prefers-reduced-motion`.

Bibliotecas completas resolvem isso, mas trazem junto uma superfície de API grande e uma identidade visual que você passa mais tempo sobrescrevendo do que usando.

A `@wabi-sabi/ui` fica no meio: comportamento e movimento resolvidos e coerentes, aparência controlada por tokens em CSS custom properties, sem runtime de estilo imposto.

Concretamente, animar a saída de um Popover com Base UI e Motion exige içar o estado `open` para fora, adicionar `keepMounted` no Portal, envolver em `AnimatePresence` e compor um componente `motion` via prop `render`. É fiação repetitiva e fácil de errar. A biblioteca encapsula isso e entrega o componente já funcionando.

### Filosofia

Três princípios, cada um com uma consequência concreta na biblioteca. Se um princípio não muda nenhuma decisão técnica, ele não entra no documento.

**Transitoriedade. Nada aparece ou desaparece de repente.**

Todo componente que monta e desmonta nasce sabendo entrar, sair e ser interrompido no meio do caminho. Isso não é um wrapper de transição pendurado por fora, é parte do contrato do componente. Durações e curvas vêm de tokens compartilhados, não de números soltos em cada arquivo. `prefers-reduced-motion` é respeitado por padrão, sem o consumidor precisar configurar nada.

**Simplicidade. Superfície pequena, feita para ser lida.**

Poucas props, poucos tokens, nomes literais. Quando um caso de uso exige controle fino, a resposta é composição via as partes do componente, não uma prop nova. A pergunta antes de adicionar qualquer coisa é se ela cabe na cabeça de quem lê a documentação uma vez só.

**Imperfeição declarada. O estado de cada peça é público.**

Cada componente carrega um status visível na documentação: estável, preview ou experimental. Preview e experimental listam suas limitações conhecidas por escrito. Nada finge estar pronto antes de estar.

### Não objetivos

- Não vai ter tema visual configurável além dos tokens. Uma identidade, dois modos de cor.
- Não vai cobrir todo componente que existe. A lista fecha em torno de oito.
- Não vai suportar bundlers antigos nem CommonJS. ESM apenas.
- Não vai ter componentes de layout tipo Grid ou Stack. Isso é CSS.
- Não vai forçar um conjunto de ícones em quem consome.

---

## Parte 2: Especificação técnica

### Stack

| Camada               | Escolha                             |
| -------------------- | ----------------------------------- |
| UI                   | React 19 + TypeScript 5             |
| Comportamento e a11y | `@base-ui/react` (1.7+)             |
| Movimento            | `motion` (12+)                      |
| Ícones               | `lucide-react`                      |
| Estilo               | CSS Modules + CSS custom properties |
| Build da lib         | tsdown (Rolldown)                   |
| Monorepo             | pnpm workspaces                     |
| Lint e format JS/TS  | Biome                               |
| Lint CSS             | Stylelint                           |
| Git hooks            | Lefthook                            |
| Commits              | commitlint, conventional commits    |
| Documentação         | Next com i18n                       |
| Testes               | Vitest + Testing Library + jest-axe |
| Versionamento        | Changesets                          |
| CI/CD                | GitHub Actions + Vercel             |

Ambiente: Node 22 LTS, pnpm 10, ambos fixados via `packageManager` e `engines`.

### Por que CSS Modules e não Tailwind ou CSS-in-JS

Quem instala a biblioteca já tem uma stack de estilo. Se a lib exigir Tailwind, ela só serve para projetos com Tailwind. Se trouxer CSS-in-JS, ela impõe runtime e complica RSC.

CSS compilado com tokens em custom properties funciona em qualquer lugar, é customizável sobrescrevendo variáveis, e força uma arquitetura de tokens de verdade.

### Modelo de distribuição

Pacote publicado no npm, não modelo copy paste.

```bash
pnpm add @wabi-sabi/ui
```

```tsx
import "@wabi-sabi/ui/styles.css"; // uma vez, na raiz
import { Dialog } from "@wabi-sabi/ui/dialog";
```

### Dependências

React e React DOM como peer. Base UI, Motion e Lucide como dependência normal, externalizadas no build.

```json
"peerDependencies": {
  "react": "^19.0.0",
  "react-dom": "^19.0.0"
},
"dependencies": {
  "@base-ui/react": "^1.7.0",
  "motion": "^12.0.0",
  "lucide-react": "^0.4.0"
}
```

React precisa ser peer obrigatoriamente, duas cópias quebram hooks e contexto.

Para as outras três, dependência normal externalizada dá install de um comando só e bundle pequeno. O gerenciador de pacote normalmente resolve para a mesma versão física quando os ranges se sobrepõem, então instância duplicada é improvável.

O risco residual é estreito: alguém envolver um componente nosso em um `AnimatePresence` da própria instalação. Como a biblioteca encapsula entrada e saída por completo, esse cenário não é esperado. Se um dia a lib passar a suportar composição externa com Motion, mover `motion` para peer resolve.

Alternativas descartadas:

- **Tudo como peer.** Elimina o risco por completo, mas alonga o install sem ganho proporcional agora.
- **Modelo Kumo.** O Kumo embute Base UI e Motion no dist e reexporta os primitivos, instruindo o consumidor a nunca instalar Base UI direto. Coerente, mas exige camada de reexport e bundle grande. Resolve um problema de escala que não temos.

### Empacotamento

Requisitos que o build precisa cumprir. A configuração exata do tsdown deve ser verificada contra a documentação atual da ferramenta, não copiada de memória.

- **ESM apenas**, `"type": "module"`. Sem build CJS. Publicar os dois formatos criaria dual package hazard, com parte do grafo carregando ESM e parte CJS, o que traz de volta o problema de instância duplicada.
- **Multi entrada.** Uma entrada por componente, mais a raiz. Subpath exports para tree shaking previsível.
- **Externalizar** `react`, `react-dom`, `@base-ui/react`, `motion`, `lucide-react`. Não embutir nada.
- **Gerar `.d.ts`** por entrada.
- **`"sideEffects": ["*.css"]`.** Sem isso, o bundler apaga `import "@wabi-sabi/ui/styles.css"` por não usar nenhum valor, e o site vai ao ar sem estilo.
- **`files`** limitado a `dist`. **`publishConfig.access`** público.
- **Mapa `exports` explícito**, com `types` antes de `import` em cada entrada.

Esqueleto do `exports`:

```json
"exports": {
  ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
  "./styles.css": "./dist/styles.css",
  "./dialog": { "types": "./dist/dialog.d.ts", "import": "./dist/dialog.js" }
}
```

### Diretiva `"use client"` injetada no build

Todos os componentes precisam da diretiva para funcionar no App Router do Next sem wrapper por parte do consumidor. Ela **não** é escrita à mão em nenhum arquivo. É injetada como banner na configuração de build, aplicada a todo chunk client.

Motivo: para o bundler a diretiva é uma string solta, uma expressão sem efeito. Minificadores removem, e transformações de módulo movem imports para cima dela, o que a invalida. O Kumo faz exatamente isso, com o comentário `// Rolldown drops "use client" directives; re-add on client chunks.`

**Verificação obrigatória, automatizada no CI:** um teste que lê os arquivos de `dist/` e falha se `"use client"` não for a primeira linha, antes de qualquer import.

### Ícones

A biblioteca usa Lucide internamente e não obriga ninguém a usar Lucide.

O shadcn resolve isso via `iconLibrary` no `components.json`, gerando os imports certos na hora de copiar o código. Como aqui publicamos pacote e não geramos código, a solução tem que ser em runtime.

Três camadas, da mais específica para a mais geral:

**1. Prop por instância.** Toda prop de ícone aceita `ReactNode`.

```tsx
<Accordion.Trigger />                        // ChevronDown do Lucide
<Accordion.Trigger icon={<Plus />} />        // qualquer coisa
```

**2. Override global via provider.** Para quem usa outro conjunto no projeto inteiro.

```tsx
<WabiSabiProvider icons={{ chevron: CaretDown, close: X, check: Check }}>
```

Mapa pequeno e fechado, com slot nomeado por função, não por nome de ícone: `chevron`, `close`, `check`, `spinner`, `arrow`.

**3. Aparência via token.** `stroke-width` é propriedade CSS, não só atributo SVG, então peso de traço é controlado globalmente sem tocar em prop nenhuma.

```css
--ws-icon-size: 1rem;
--ws-icon-stroke: 1.25;
```

Componente nunca importa de `lucide-react` diretamente. Sempre pelo registry, senão o override global deixa de funcionar.

Descartado: exigir o conjunto de ícones como peer obrigatório, modelo que o Kumo adota com `@phosphor-icons/react`. Força adoção do nosso conjunto em quem já usa outro.

### Arquitetura de tokens

Três níveis, em CSS custom properties, sob o prefixo `--ws-`. Os valores completos estão na Parte 3.

1. **Primitivos.** Seis escalas de doze passos, cada passo com função fixa.
2. **Semânticos.** O que os componentes usam. `--ws-base`, `--ws-text-subtle`, `--ws-danger-tint`.
3. **De componente.** Ponto de customização fino. `--ws-dialog-padding`.

Componente nunca referencia primitivo direto. Sempre semântico ou de componente. Regra verificada por Stylelint, não apenas escrita aqui.

Modo escuro via `[data-theme="dark"]` e `prefers-color-scheme`, redefinindo apenas os valores primitivos. Os mapeamentos semânticos não mudam entre modos.

**Tokens de movimento**, também expostos como objeto TypeScript para uso dentro do Motion:

```
--ws-duration-instant / fast / base / slow
--ws-ease-enter / exit / spring
--ws-distance-sm / md
```

### Ciclo de vida de montagem e desmontagem

**Decisão tomada.** O Motion controla entrada e saída. O Base UI mantém o elemento montado. É o caminho documentado oficialmente pelo Motion na página de integração com Base UI.

Padrão para componentes que controlam a própria renderização condicional, como Popover, Dialog e ContextMenu:

1. Içar o estado `open` para fora com `useState`.
2. Adicionar `keepMounted` no `Portal`.
3. Renderizar o `Portal` condicionalmente dentro de `AnimatePresence`.
4. Aplicar a animação via componente `motion` passado na prop `render`.

```tsx
const [open, setOpen] = useState(false);

<ContextMenu.Root open={open} onOpenChange={setOpen}>
  <ContextMenu.Trigger>Open</ContextMenu.Trigger>
  <AnimatePresence>
    {open && (
      <ContextMenu.Portal keepMounted>
        <ContextMenu.Positioner>
          <ContextMenu.Popup
            render={
              <motion.div
                initial={{ opacity: 0, transform: "scale(0.9)" }}
                animate={{ opacity: 1, transform: "scale(1)" }}
                exit={{ opacity: 0, transform: "scale(0.9)" }}
              />
            }
          />
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    )}
  </AnimatePresence>
</ContextMenu.Root>;
```

**Restrição crítica.** O `Portal` só mantém a árvore montada enquanto o Base UI detecta animações via `element.getAnimations()`. O Motion roda com aceleração de hardware apenas `opacity`, `transform`, `filter` e `clipPath`. Se a saída animar só `height`, o Base UI não detecta nada, desmonta antes da hora e a saída nunca aparece.

Consequências:

- Os presets de movimento se restringem a essas quatro propriedades. São as que não causam layout nem paint de qualquer forma.
- Accordion, que naturalmente pediria `height`, precisa de tratamento próprio. Caso especial documentado.
- Toda essa fiação fica interna. O consumidor recebe `<Dialog open onOpenChange>` funcionando.

`prefers-reduced-motion` é tratado numa camada só, via `useReducedMotion` do Motion combinado com os presets. Componente individual não implementa isso.

### Estrutura de arquivos

A documentação vive dentro do repositório da lib. Ela é o consumidor real, precisa quebrar quando a API quebrar, e um repo só simplifica CI e release.

```
wabi-sabi/
├── packages/
│   └── ui/
│       ├── src/
│       │   ├── components/
│       │   │   └── dialog/
│       │   │       ├── index.ts
│       │   │       ├── dialog.tsx
│       │   │       ├── dialog.module.css
│       │   │       ├── dialog.test.tsx
│       │   │       └── meta.ts
│       │   ├── icons/
│       │   │   ├── registry.ts
│       │   │   └── provider.tsx
│       │   ├── styles/
│       │   │   ├── primitives.css
│       │   │   ├── semantic.css
│       │   │   ├── dark.css
│       │   │   └── index.css
│       │   ├── motion/
│       │   │   ├── tokens.ts
│       │   │   └── presets.ts
│       │   ├── lib/
│       │   └── index.ts
│       ├── package.json
│       ├── tsdown.config.ts
│       └── tsconfig.json
│
├── apps/
│   └── docs/                    ← Next
│       ├── src/
│       └── package.json
│
├── scripts/
│   └── new-component.ts
├── .changeset/
├── .github/workflows/
├── AGENTS.md
├── CLAUDE.md
├── biome.json
├── stylelint.config.js
├── lefthook.yml
├── commitlint.config.js
├── pnpm-workspace.yaml
├── LICENSE                      ← MIT
└── README.md
```

O portfólio fica em repositório separado, em Next.js, e consome a versão publicada. É o segundo consumidor e valida a diretiva `"use client"` num ambiente RSC real.

### Convenções

- Arquivos e pastas em kebab-case. Componentes em PascalCase.
- Compound components seguindo a convenção do Base UI: `Dialog.Root`, `Dialog.Trigger`, `Dialog.Portal`, `Dialog.Content`.
- `displayName` definido em todo componente.
- Classes CSS em camelCase dentro do módulo, sem prefixo, já que CSS Modules escopa.
- Tipos exportados junto com o componente, nomeados `DialogRootProps` e assim por diante.
- Toda prop pública documentada com TSDoc. É de onde a doc extrai as tabelas de API.

### Definição de pronto

Um componente só é considerado pronto quando tem, todos os seis:

1. Implementação com entrada, saída e interrupção funcionando.
2. `*.module.css` usando apenas tokens semânticos ou de componente.
3. Teste de comportamento e teste de acessibilidade com axe.
4. `meta.ts` com `status`, `since` e `knownLimitations`.
5. Página MDX com exemplo interativo e tabela de props.
6. Navegação por teclado verificada manualmente e descrita na página.

### Qualidade e acessibilidade

- Vitest com happy-dom, Testing Library, `jest-axe` em cada componente.
- Foco visível obrigatório, com token próprio de anel de foco.
- Contraste mínimo AA nos dois modos de cor.
- Playwright fica para depois, se necessário para casos de interrupção de animação.
- Storybook fica de fora. A própria doc é o playground.

### Release

- Conventional commits, validados por commitlint no hook de commit.
- Changesets para changelog e bump. Hook de pre-push exige changeset em mudança dentro de `packages/ui`.
- Enquanto for `0.x`, breaking change sobe a minor. A `1.0.0` só sai quando o núcleo estiver todo estável.
- Publicação no npm com provenance, via GitHub Actions.
- Doc publicada na Vercel a cada merge na main.

### CI

`ci.yml`, em todo push e PR:

1. `pnpm install --frozen-lockfile`
2. `biome ci`
3. `stylelint`
4. `tsc --noEmit`
5. `vitest run`
6. `pnpm build`
7. **Smoke test do pacote:** verificar no `dist` que `"use client"` está na primeira linha dos chunks client, que os `.d.ts` existem, que o CSS foi gerado, e que todo caminho declarado em `exports` existe de fato.

`release.yml`, no merge para main: ação do Changesets abrindo PR de versão ou publicando.

### Escopo dos componentes

**Núcleo, para a doc e o portfólio funcionarem:** Button, Input, Link, Code.

**O trabalho de verdade:**

_Grupo 1: marketing e movimento_

<SplitText> — título que anima por palavra ou letra na entrada.

O efeito mais reconhecível de site de marca, e o que tem a armadilha de acessibilidade mais severa: quebrar uma frase em quarenta <span> faz o leitor de tela ler letra por letra. Solução é a frase inteira num nó acessível e os pedaços animados com aria-hidden. Somam-se o problema de quebra de linha no resize e a possibilidade de animar o eixo de peso da fonte variável, e não só opacidade. Com Fraunces, que tem eixo de imperfeição, a demo ganha identidade própria.

<Reveal> — entrada no scroll, com cascata para grupos.

Demonstra useInView, orquestração de stagger e escolha de threshold. Detalhe de craft: nunca animar elemento que já estava visível no carregamento. É o erro mais comum e faz a página parecer quebrada em telas grandes.

<StickyScene> — seção que fixa enquanto o conteúdo interno avança com o scroll.

A peça central da narrativa de página de lançamento. Demonstra useScroll com offsets, interpolação ligada ao progresso e derivação de índice a partir de valor contínuo. Detalhe de craft: em prefers-reduced-motion a cena não fixa, vira lista vertical. Não é degradação, é uma segunda composição pensada.

<Marquee> — faixa infinita para logos ou depoimentos.

Loop contínuo sem salto, medição e duplicação de conteúdo, comportamento no resize. Detalhe de craft: pausa no hover e no foco, conteúdo duplicado com aria-hidden para o leitor não ler duas vezes. Toda landing page tem uma faixa dessas e quase todas erram esses dois pontos.

<Counter> — número que anima ao entrar em vista.

useMotionValue com spring, formatação por locale e números tabulares para o layout não tremer durante a contagem. Detalhe de craft: o leitor de tela recebe o valor final uma vez, não cada quadro. Escolha temática: a Buffer é uma empresa de métricas transparentes, com dashboard público.

_Grupo 2: complexidade de engenharia_

<ExpandableCard> — grade de cards onde um se expande para detalhe.

O destaque do projeto. A miniatura se transforma no hero em vez de aparecer por cima, usando layoutId do Motion. A profundidade está no que quebra:

Distorção quando a proporção do card e a do detalhe diferem, e a correção de escala.
border-radius deforma junto com a escala, precisa de compensação inversa.
Interrupção no meio do caminho, clicando em outro card antes do primeiro terminar.
É um diálogo: armadilha de foco, Escape, retorno de foco ao card de origem, trava de scroll.

Uso em marketing é direto: galeria de case studies, depoimentos, cards de feature.

<Disclosure> — FAQ expansível.

A história de engenharia mais funda no menor pacote. height anima mal, força layout a cada quadro, e não é detectada como animação pelo Base UI, então o elemento desmonta antes de terminar. Três saídas possíveis, e escolher entre elas com argumento é o tipo de raciocínio que a etapa de revisão de PR do processo deles avalia:

grid-template-rows de 0fr para 1fr, anima sem medir nada.
Medir a altura e animar transform, com compensação inversa no conteúdo.
clip-path, acelerada, mas corta em vez de empurrar.
Bônus, se sobrar tempo

<ThemeToggle> com View Transitions API. Troca de tema como um círculo que se expande a partir do botão. Poucas linhas, efeito alto, e mostra acompanhamento de API nova de plataforma. O modo escuro vai existir de qualquer forma.

<Reorder>, lista arrastável com spring. A fila de posts é literalmente o produto da Buffer, e reordenação por teclado é um problema de acessibilidade que quase ninguém resolve.

---

## Parte 3: Identidade visual

### Princípios de cor

**Marca pode ser dessaturada, status não pode.** Cor funcional precisa ser reconhecida antes de ser bonita. A escala `sakura` é deliberadamente suave, porque é identidade. `red`, `yellow`, `green` e `blue` são saturadas o suficiente para ninguém errar a leitura.

**O neutro é quente.** Hue 70, croma muito baixo. Puxa levemente para barro e madeira, que é o material de referência do wabi-sabi, sem virar bege. Evita deliberadamente o fundo creme.

**Nunca só cor.** Componente de status sempre combina cor com ícone e texto. Nenhuma informação depende exclusivamente de matiz.

**Nomes literais na camada primitiva**, com uma exceção. `sakura` não é um slot de cor, é a identidade do projeto. As outras cinco são utilitárias e se chamam pelo que são.

### Escalas primitivas

Doze passos por escala, cada passo com uma função fixa. Este é o contrato: nenhum passo é escolhido por gosto, todos por papel.

| Passo | Papel                                    |
| ----- | ---------------------------------------- |
| 1     | Fundo da página                          |
| 2     | Fundo sutil, superfície elevada          |
| 3     | Fundo de elemento de UI                  |
| 4     | Fundo em hover                           |
| 5     | Fundo em active ou selecionado           |
| 6     | Borda sutil, separador                   |
| 7     | Borda de elemento de UI                  |
| 8     | Borda em hover, anel de foco             |
| 9     | Preenchimento sólido, a cor reconhecível |
| 10    | Sólido em hover                          |
| 11    | Texto de baixo contraste                 |
| 12    | Texto de alto contraste                  |

O passo 9 é o mesmo valor nos dois modos, de propósito. É a cor da marca, ela não muda de identidade quando alguém troca o tema. Todo o resto inverte.

**Exceção do amarelo.** Amarelo não existe em luminosidade baixa, nessa faixa ele vira marrom em qualquer hue. Por isso `yellow` usa um perfil de escala brilhante: os passos 9 e 10 são claros, e o texto em cima deles é escuro. Consequência importante e contraintuitiva:

```css
--ws-on-warning: #423000; /* valor fixo, idêntico nos dois modos */
```

É o único token que não inverte entre claro e escuro. Precisa estar documentado, senão alguém vai "corrigir" isso achando que é bug.

Geração: todas as escalas foram geradas em OKLCH com perfis de luminosidade e croma constantes por passo, o que mantém as seis escalas alinhadas entre si. Alterar uma cor significa alterar hue e multiplicador de croma, nunca hex na mão.

### Valores primitivos

```css
:root {
  --ws-white: #ffffff;
  --ws-black: #000000;

  /* neutral */
  --ws-neutral-1: #fdfdfc;
  --ws-neutral-2: #f9f8f7;
  --ws-neutral-3: #f2f0ee;
  --ws-neutral-4: #ebe8e6;
  --ws-neutral-5: #e3e0dd;
  --ws-neutral-6: #d8d5d2;
  --ws-neutral-7: #cac7c3;
  --ws-neutral-8: #b5b0ac;
  --ws-neutral-9: #736e68;
  --ws-neutral-10: #67625d;
  --ws-neutral-11: #5e5a55;
  --ws-neutral-12: #302d2b;

  /* sakura */
  --ws-sakura-1: #fffafe;
  --ws-sakura-2: #fff4fb;
  --ws-sakura-3: #ffe8f4;
  --ws-sakura-4: #ffddee;
  --ws-sakura-5: #ffd1e7;
  --ws-sakura-6: #f7c5dd;
  --ws-sakura-7: #ecb5d0;
  --ws-sakura-8: #de99bc;
  --ws-sakura-9: #9e507a;
  --ws-sakura-10: #93436f;
  --ws-sakura-11: #834165;
  --ws-sakura-12: #432033;

  /* blue */
  --ws-blue-1: #f9fdff;
  --ws-blue-2: #f1f9ff;
  --ws-blue-3: #e4f1ff;
  --ws-blue-4: #d7eaff;
  --ws-blue-5: #cae1ff;
  --ws-blue-6: #bed7ff;
  --ws-blue-7: #acc8fa;
  --ws-blue-8: #8fb1f0;
  --ws-blue-9: #466db5;
  --ws-blue-10: #3a60aa;
  --ws-blue-11: #385997;
  --ws-blue-12: #1c2d4d;

  /* green */
  --ws-green-1: #f8fff9;
  --ws-green-2: #f0fcf1;
  --ws-green-3: #e1f8e3;
  --ws-green-4: #d4f3d7;
  --ws-green-5: #c5edc9;
  --ws-green-6: #b9e3bd;
  --ws-green-7: #a6d6ac;
  --ws-green-8: #85c38d;
  --ws-green-9: #338144;
  --ws-green-10: #217636;
  --ws-green-11: #276b36;
  --ws-green-12: #14361b;

  /* yellow */
  --ws-yellow-1: #fffdf4;
  --ws-yellow-2: #fff8e8;
  --ws-yellow-3: #ffefcb;
  --ws-yellow-4: #fce7b4;
  --ws-yellow-5: #f9de9b;
  --ws-yellow-6: #f1d388;
  --ws-yellow-7: #e6c36b;
  --ws-yellow-8: #d6ab32;
  --ws-yellow-9: #ffc807;
  --ws-yellow-10: #f2bc00;
  --ws-yellow-11: #876300;
  --ws-yellow-12: #423000;

  /* red */
  --ws-red-1: #fff9f7;
  --ws-red-2: #fff2ee;
  --ws-red-3: #ffe6e1;
  --ws-red-4: #ffdbd5;
  --ws-red-5: #ffcfc7;
  --ws-red-6: #ffc0b6;
  --ws-red-7: #ffaba0;
  --ws-red-8: #ff8b7f;
  --ws-red-9: #c03631;
  --ws-red-10: #b42121;
  --ws-red-11: #a02925;
  --ws-red-12: #521613;
}

[data-theme="dark"] {
  /* neutral */
  --ws-neutral-1: #121111;
  --ws-neutral-2: #1a1919;
  --ws-neutral-3: #262523;
  --ws-neutral-4: #2f2d2b;
  --ws-neutral-5: #383634;
  --ws-neutral-6: #43413e;
  --ws-neutral-7: #524f4c;
  --ws-neutral-8: #696561;
  --ws-neutral-9: #736e68;
  --ws-neutral-10: #817c77;
  --ws-neutral-11: #b4b0ac;
  --ws-neutral-12: #e9e7e5;

  /* sakura */
  --ws-sakura-1: #151012;
  --ws-sakura-2: #20161b;
  --ws-sakura-3: #331d28;
  --ws-sakura-4: #402332;
  --ws-sakura-5: #4d293c;
  --ws-sakura-6: #5a3247;
  --ws-sakura-7: #6d3f57;
  --ws-sakura-8: #8b506f;
  --ws-sakura-9: #9e507a;
  --ws-sakura-10: #ae5f89;
  --ws-sakura-11: #dc9abb;
  --ws-sakura-12: #fddeec;

  /* blue */
  --ws-blue-1: #0f1216;
  --ws-blue-2: #141a23;
  --ws-blue-3: #1a2539;
  --ws-blue-4: #1f2d49;
  --ws-blue-5: #243657;
  --ws-blue-6: #2d4165;
  --ws-blue-7: #384f7a;
  --ws-blue-8: #48659c;
  --ws-blue-9: #466db5;
  --ws-blue-10: #547cc5;
  --ws-blue-11: #90b1ee;
  --ws-blue-12: #d9e9ff;

  /* green */
  --ws-green-1: #0e130f;
  --ws-green-2: #131c14;
  --ws-green-3: #172b1a;
  --ws-green-4: #19351e;
  --ws-green-5: #1d3f23;
  --ws-green-6: #264b2c;
  --ws-green-7: #305b37;
  --ws-green-8: #3c7546;
  --ws-green-9: #338144;
  --ws-green-10: #439152;
  --ws-green-11: #87c28f;
  --ws-green-12: #d7f0d9;

  /* yellow */
  --ws-yellow-1: #14110c;
  --ws-yellow-2: #1e190d;
  --ws-yellow-3: #2f2303;
  --ws-yellow-4: #3c2b00;
  --ws-yellow-5: #493300;
  --ws-yellow-6: #563d00;
  --ws-yellow-7: #684b00;
  --ws-yellow-8: #836000;
  --ws-yellow-9: #ffc807;
  --ws-yellow-10: #f2bc00;
  --ws-yellow-11: #e1b850;
  --ws-yellow-12: #ffe9b6;

  /* red */
  --ws-red-1: #180f0e;
  --ws-red-2: #251412;
  --ws-red-3: #3d1815;
  --ws-red-4: #4e1b17;
  --ws-red-5: #5d201b;
  --ws-red-6: #6c2823;
  --ws-red-7: #82332d;
  --ws-red-8: #a64039;
  --ws-red-9: #c03631;
  --ws-red-10: #d1473f;
  --ws-red-11: #fc8d81;
  --ws-red-12: #ffdad3;
}
```

Contraste verificado nas seis escalas, nos dois modos:

| Par                                | Claro       | Escuro      |
| ---------------------------------- | ----------- | ----------- |
| Passo 11 sobre passo 2             | 5.2 a 6.8   | 7.8 a 9.3   |
| Passo 12 sobre passo 1             | 12.5 a 13.6 | 14.6 a 15.8 |
| Branco sobre passo 9               | 4.8 a 5.5   | 4.8 a 5.5   |
| `--ws-on-warning` sobre `yellow-9` | 8.2         | 8.2         |

Todos passam AA. Essa verificação precisa virar teste automatizado, não conferência manual.

### Camada semântica

É o que os componentes consomem. Escala primitiva nunca é referenciada direto em componente, regra verificada por Stylelint.

```css
:root {
  /* superfícies */
  --ws-canvas: var(--ws-neutral-1);
  --ws-base: var(--ws-neutral-2);
  --ws-elevated: var(--ws-neutral-3);
  --ws-recessed: var(--ws-neutral-4);
  --ws-tint: var(--ws-neutral-3);
  --ws-contrast: var(--ws-neutral-12);

  /* controles */
  --ws-control: var(--ws-neutral-3);
  --ws-control-hover: var(--ws-neutral-4);
  --ws-control-active: var(--ws-neutral-5);

  /* bordas */
  --ws-hairline: var(--ws-neutral-6);
  --ws-line: var(--ws-neutral-7);
  --ws-focus: var(--ws-sakura-8);

  /* texto */
  --ws-text-strong: var(--ws-neutral-12);
  --ws-text-default: var(--ws-neutral-12);
  --ws-text-subtle: var(--ws-neutral-11);
  --ws-text-placeholder: var(--ws-neutral-10);
  --ws-text-inactive: var(--ws-neutral-8);
  --ws-text-inverse: var(--ws-neutral-1);

  /* accent, o conjunto customizável */
  --ws-accent: var(--ws-sakura-9);
  --ws-accent-hover: var(--ws-sakura-10);
  --ws-accent-tint: var(--ws-sakura-3);
  --ws-accent-border: var(--ws-sakura-7);
  --ws-accent-text: var(--ws-sakura-11);
  --ws-on-accent: var(--ws-white);

  /* status */
  --ws-info: var(--ws-blue-9);
  --ws-info-tint: var(--ws-blue-3);
  --ws-info-border: var(--ws-blue-7);
  --ws-info-text: var(--ws-blue-11);
  --ws-on-info: var(--ws-white);

  --ws-success: var(--ws-green-9);
  --ws-success-tint: var(--ws-green-3);
  --ws-success-border: var(--ws-green-7);
  --ws-success-text: var(--ws-green-11);
  --ws-on-success: var(--ws-white);

  --ws-warning: var(--ws-yellow-9);
  --ws-warning-tint: var(--ws-yellow-3);
  --ws-warning-border: var(--ws-yellow-7);
  --ws-warning-text: var(--ws-yellow-11);
  --ws-on-warning: #423000;

  --ws-danger: var(--ws-red-9);
  --ws-danger-tint: var(--ws-red-3);
  --ws-danger-border: var(--ws-red-7);
  --ws-danger-text: var(--ws-red-11);
  --ws-on-danger: var(--ws-white);

  /* link */
  --ws-link: var(--ws-blue-11);
}
```

Os mapeamentos semânticos são idênticos nos dois modos. Só os valores primitivos por trás mudam, o que significa que o modo escuro não exige nenhuma redefinição semântica.

### Sombras

Sombra não sai de passo de escala, porque sombra em modo escuro não é sombra clara aclarada. Alfa próprio, valores diferentes por modo.

```css
:root {
  --ws-shadow-edge: oklch(0% 0 0 / 0.12);
  --ws-shadow-drop: oklch(0% 0 0 / 0.08);
}

[data-theme="dark"] {
  --ws-shadow-edge: oklch(100% 0 0 / 0.1);
  --ws-shadow-drop: oklch(0% 0 0 / 0.3);
}
```

### Customização

O ponto de customização público é o conjunto `accent`, não a escala `sakura`. Quem quer outra marca sobrescreve os seis tokens de accent, não a escala primitiva. Sobrescrever um só quebraria os estados de hover, borda e texto.

As escalas de status também são sobrescrevíveis pela camada semântica, mas a doc destaca a accent, que é a que muda a identidade do produto.

**Caminho opcional: derivação por hue.** Além de sobrescrever os seis tokens, a lib oferece um atalho de um token só.

```css
:root {
  --ws-brand-hue: 262;
}
```

A escala de accent é derivada com relative color syntax, herdando **apenas o hue** e mantendo o perfil de luminosidade e croma já verificado do sistema.

```css
--ws-accent: oklch(0.54 0.115 var(--ws-brand-hue));
--ws-accent-hover: oklch(0.5 0.119 var(--ws-brand-hue));
--ws-accent-tint: oklch(0.956 0.034 var(--ws-brand-hue));
```

Assim as proporções continuam sendo do sistema, não da pessoa. Documentar o aviso: em hue arbitrário o contraste é aproximado, não garantido, porque o navegador corta valores fora do gamut sRGB em vez de mapeá-los.

**Decisão sobre onde usar derivação.** Relative color syntax é Baseline desde 2024, com suporte em Chrome, Firefox, Safari e Edge e cerca de 88 a 90% de uso global, então compatibilidade não é o fator limitante. Ainda assim:

| Camada                 | Abordagem                            | Motivo                                                                                       |
| ---------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------- |
| Seis escalas da lib    | Valores estáticos gerados por script | Gamut mapping controlado, contraste verificado por teste, valores inspecionáveis no devtools |
| Customização de accent | Derivação opcional por hue           | Quem consome não tem o script; superfície de um token só                                     |

Os 144 valores não são escritos à mão, são gerados e commitados. Trocá-los por derivação em runtime não economiza trabalho, apenas troca uma garantia testada por uma conveniência.

**Nota adjacente.** `contrast-color()` virou Baseline em abril de 2026 e escolhe automaticamente entre preto e branco sobre um fundo. Resolveria `--ws-on-warning` sozinho, mas só retorna preto ou branco, e o nosso valor é um marrom escuro escolhido de propósito. Fica registrado, não adotado.

### Tipografia

**A biblioteca não embarca fonte nenhuma**, pela mesma razão dos ícones. Os tokens existem, os valores padrão herdam do projeto que consome.

```css
--ws-font-sans: inherit;
--ws-font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
```

A opinião tipográfica mora na doc e no portfólio, onde ela é nossa e não imposta a ninguém.

**Para a doc:**

| Papel      | Fonte           |
| ---------- | --------------- |
| Display    | Fraunces        |
| Texto e UI | Instrument Sans |
| Código     | Commit Mono     |

Fraunces é variável e tem dois eixos incomuns, `SOFT` e `WONK`. O `WONK` troca certas letras por formas propositalmente tortas. Uma tipografia com eixo literal de imperfeição controlada, num projeto chamado wabi-sabi. Instrument Sans é humanista, variável e aberta, deliberadamente não Inter.

**Escala modular**, razão 1.2 a partir de 16px:

```css
--ws-text-xs: 0.694rem; /* 11.1px */
--ws-text-sm: 0.833rem; /* 13.3px */
--ws-text-base: 1rem; /* 16px   */
--ws-text-lg: 1.2rem; /* 19.2px */
--ws-text-xl: 1.44rem; /* 23.0px */
--ws-text-2xl: 1.728rem; /* 27.6px */
--ws-text-3xl: 2.074rem; /* 33.2px */

--ws-leading-tight: 1.2;
--ws-leading-base: 1.5;
--ws-leading-prose: 1.65;

--ws-weight-regular: 400;
--ws-weight-medium: 500;
```

Medida de linha abaixo de 75 caracteres na prosa da doc. Peso 600 e 700 ficam fora, dois pesos bastam.

### Tokens de ícone

```css
--ws-icon-size: 1rem;
--ws-icon-stroke: 1.25;
```

`stroke-width` é propriedade CSS, não só atributo SVG, então o peso de traço do Lucide é controlado globalmente por token, sem passar prop em componente nenhum.

---

## Parte 4: Setup de desenvolvimento com IA

### Divisão de trabalho

Esta divisão é deliberada e não deve ser invertida. O projeto existe para aprender React pela ótica de componentes e para aprender animação, então essas duas coisas são escritas à mão.

**IA faz:** configuração de build e empacotamento, workflows de CI, scaffold de componente, configuração de lint e format, boilerplate de teste, scripts, geração de tipos, migrações mecânicas, refatoração em massa, documentação de infraestrutura.

**Flávia faz:** implementação dos componentes, desenho da API pública, presets e lógica de movimento, decisões de token e identidade visual, conteúdo conceitual das páginas de doc.

Quando houver dúvida sobre de que lado uma tarefa cai, a pergunta é se ela ensina alguma coisa sobre React ou animação. Se ensina, é dela.

### `AGENTS.md`

Vive na raiz e é a fonte única. `CLAUDE.md` é apenas um ponteiro de uma linha para ele, para não haver duas verdades divergindo.

Conteúdo em inglês, organizado em: visão geral, estrutura, convenções, anti-padrões em tabela, comandos, e uma lista explícita do que nunca executar. O modelo de referência é o `AGENTS.md` do Kumo.

O conteúdo de maior valor não é descrever a estrutura de pastas, que o modelo lê sozinho. É codificar as decisões que contrariam o padrão que ele produziria por conta própria:

```markdown
## Critical rules

- The Base UI package is `@base-ui/react`. NEVER `@base-ui-components/react`,
  which is the old package and appears in nearly all pre-2026 material,
  including Motion's own integration page.
- NEVER write `"use client"` in source files. The directive is injected as a
  build banner. Writing it by hand duplicates it and pollutes diffs.
- Enter and exit animations use ONLY `opacity`, `transform`, `filter` and
  `clipPath`. Any other property makes Base UI unmount before the animation
  finishes, because it detects animations via `element.getAnimations()`.
- Components NEVER reference primitive tokens. Semantic or component tokens
  only. Enforced by Stylelint.
- ESM only. No CJS, no `require`.
- Structural icons come from the icon registry, never imported directly from
  `lucide-react` inside a component.
- New components are created with the scaffold, never by hand.
- All project artifacts are written in English.

## Never run

`pnpm publish`, `changeset publish`, `npm version`
```

Formato "faça X, nunca Y, e o motivo" funciona melhor que prosa corrida. O Kumo usa tabela de anti-padrão com três colunas: padrão, por que é errado, o que fazer no lugar.

Um `AGENTS.md` menor em `packages/ui/` com as convenções específicas de componente.

### Guardrails automatizados

Esta parte importa mais que o `AGENTS.md`, porque instrução em markdown é sugestão e regra verificada é regra.

| Guardrail                                                         | O que protege                                                    |
| ----------------------------------------------------------------- | ---------------------------------------------------------------- |
| `scripts/new-component.ts`                                        | Estrutura de componente deixa de depender do modelo lembrar dela |
| Regra Stylelint proibindo `--ws-<primitivo>` em `components/**`   | Arquitetura de três camadas não vira sugestão                    |
| Regra Biome proibindo import de `lucide-react` em `components/**` | Override global de ícone continua funcionando                    |
| Smoke test do `dist` no CI                                        | Protege contra o bundler apagar a diretiva, não só contra a IA   |
| Hook de pre-push exigindo changeset                               | Nenhuma mudança publicável sem changelog                         |
| commitlint no hook de commit                                      | Conventional commits de verdade                                  |

O scaffold gera os cinco arquivos do componente, registra a entrada no `exports` do `package.json`, adiciona a entrada de build e cria o esqueleto da página MDX.

### Documentação legível por máquina

Gerar `llms.txt` no build do Astro, a partir do MDX e dos `meta.ts`. Baixo esforço e serve para agentes consumirem a lib sem alucinar API.

O Kumo vai além disso, com um `component-registry.json` gerado por codegen e uma CLI (`npx @cloudflare/kumo doc Button`). Fica como possibilidade futura, não é necessário agora.

---

## Ordem de execução

### Fase 0. Fundação

Tudo aqui é trabalho de IA.

1. Repositório `wabi-sabi`, monorepo com pnpm workspaces, Node 22 e pnpm 10 fixados. Licença MIT.
2. Biome, Stylelint, Lefthook, commitlint, Changesets configurados.
3. `packages/ui` com tsdown: multi entrada, externals corretos, `.d.ts`, banner de `"use client"`, mapa de `exports`.
4. Vitest com happy-dom, Testing Library e jest-axe.
5. `AGENTS.md`, `CLAUDE.md` ponteiro, `README.md`. Em inglês.
6. `scripts/new-component.ts`.
7. `ci.yml` completo, incluindo o smoke test do `dist`.
8. Um componente trivial de teste, e publicação de uma `0.0.1` no npm.
9. Confirmar no pacote publicado: `.d.ts` presentes, CSS gerado, `"use client"` na primeira linha, todo caminho de `exports` existindo.

Publicar cedo, mesmo sem nada dentro, resolve as dores de empacotamento antes de existir código para quebrar.

### Fase 1. Sistema

10. Camadas de token conforme a Parte 3, modo escuro, tokens de movimento. Regra do Stylelint ligada.
    Adicionar teste automatizado de contraste sobre os pares da tabela da Parte 3.
11. Presets do Motion e tratamento de `prefers-reduced-motion` numa camada só.
12. Registry de ícones com provider e defaults do Lucide.

### Fase 2. Primeiro componente completo

13. Dialog inteiro, pelos seis critérios da definição de pronto.
14. Escrever a decisão de arquitetura de movimento. Primeiro post do blog.

### Fase 3. Documentação

15. App Astro consumindo o workspace, layout construído com o que já existe.
16. `llms.txt` gerado no build.
17. Componentes do núcleo entram conforme a doc pedir. Não construir Button antes da doc precisar.

### Fase 4. Profundidade

18. Toast, Drawer, Accordion, Combobox, um por vez, cada um com sua página.
19. Release automatizado com Changesets.

---

## Pendências

- **Accordion.** Precisa de `height` mas depende de propriedade acelerada para não desmontar cedo. Investigar `clipPath` ou escala compensada.
- **Lista final de componentes**, depois que a doc mostrar o que ela realmente precisa.
- **Conta e scope no npm.** Criar a organização `wabi-sabi` e o token de publicação antes da Fase 0 item 8. Passo manual.
- **Figma.** Adiado. Fora de escopo neste documento.
