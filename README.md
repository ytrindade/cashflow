## Sobre o projeto

Esta **API**, desenvolvida utilizando **.NET 8**, adota os princípios do **Domain-Driven Design (DDD)** para oferecer uma solução estruturada e eficaz no gerenciamento de despesas. O principal objetivo é permitir o registro de despesas, detalhando informações como título, data e hora, descrição, valor e tipo de pagamento, com os dados sendo armazenados de forma segura em um banco de dados MySQL.

A arquitetura da API baseia-se em **REST**, utilizando métodos **HTTP** padrão para uma comunicação eficiente e simplificada. Além disso, é complementada por uma documentação **Swagger**, que proporciona uma interface gráfica interativa para que os desenvolvedores possam explorar e testar os endpoints de maneira fácil.

A aplicação foi construída com foco em qualidade, integridade e confiabilidade, garantindo que cada etapa do fluxo de dados seja validada e tratada de forma adequada. As regras de negócio são aplicadas de maneira consistente, e os comportamentos essenciais são verificados por testes, assegurando maior estabilidade, segurança e facilidade de manutenção ao longo da evolução do sistema.

Dentre os pacotes NuGet utilizados, o **AutoMapper** é o responsável pelo mapeamento entre objetos de domínio e requisição/resposta, reduzindo a necessidade de código repetitivo e manual. O **Shouldly** é utilizado nos testes de unidade para tornar as verificações mais legíveis, ajudando a escrever testes claros e compreensíveis, juntamente com a biblioteca **Bogus**, responsável por gerar dados aleatórios, a fim de evitar a escrita de valores iguais. Para as validações, o **FluentValidation** é usado para implementar regras de validação de forma simples e intuitiva nas classes de requisições, mantendo o código limpo e fácil de manter. Por fim, o **EntityFramework** atua como um ORM (Object-Relational Mapper) que simplifica as interações com o banco de dados, permitindo o uso de objetos .NET para manipular dados diretamente, sem a necessidade de lidar com consultas SQL.

Além da API, o projeto conta com um **frontend desenvolvido em React**, utilizando **JavaScript** e **Tailwind CSS** para a construção da interface. A aplicação web foi criada com foco em proporcionar uma experiência moderna e intuitiva, permitindo a interação com a API de forma simples e eficiente, possibilitando o cadastro, visualização e gerenciamento das informações de maneira dinâmica, com comunicação direta com os endpoints. O uso do Tailwind CSS contribui para um design consistente e de fácil manutenção, enquanto o React permite a criação de componentes reutilizáveis, organizados e escaláveis.


![hero-image]

### Features
- **Domain-Driven Design (DDD)**: Estrutura modular que facilita o entendimento e a manutenção do domínio da aplicação.
- **Testes de Unidade**: Testes abrangentes com FluentAssertions para garantir a funcionalidade e a qualidade.
- **RESTful API com Documentação Swagger**: Interface documentada que facilita a integração e o teste por parte dos desenvolvedores.
- **Geração de Relatórios**: Capacidade de exportar relatórios detalhados para **PDF** e **Excel**, oferecendo uma análise visual das despesas.
- **Frontend em React**: Interface interativa desenvolvida com **React**, **JavaScript** e **Tailwind CSS**, permitindo o cadastro, consulta e gerenciamento das despesas de forma dinâmica e integrada à API.

### Construído com
![badge-dot-net]
![badge-visual-studio]
![badge-mysql]
![badge-swagger]
![badge-react]
![badge-javascript]
![badge-tailwind]
![badge-vscode]


## Getting Started

Para obter uma cópia local funcionando, siga estes passos

### Requisitos

- Visual Studio versão 2022+ ou Visual Studio Code
- Windows 10+ ou Linux/MacOS com [.NET SDK][dot-net-sdk] instalado
- Node.js 18+
- MySql Server

### Instalação
1. Clone o repositório:
```sh
git clone https://github.com/ytrindade/cashflow.git 
```
2. Substitua as informações no arquivo `appsettings.Development.json` (No meu caso, foram informações temporárias somente para teste).


### Executando o projeto
1. Para executar a api, na pasta raiz do projeto, execute no terminal:
```sh
dotnet run --project .\src\CashFlow.Api\CashFlow.Api.csproj
```
(Certifique-se de que a api está rodando em https://localhost:7071)

2. Execute:
```sh
cd frontend
```
3. Instale as dependências:
```sh
npm install
```
4. Execute o frontend:
```sh
npm run dev
```
5. Aproveite o seu teste :)









<!-- Links -->
[dot-net-sdk]: https://dotnet.microsoft.com/en-us/download/dotnet/8.0

<!-- Images -->
[hero-image]: Images/heroimage.png

<!-- Badges -->
[badge-dot-net]: https://img.shields.io/badge/.NET-512BD4?logo=dotnet&logoColor=fff&style=for-the-badge
[badge-visual-studio]: https://img.shields.io/badge/Visual%20Studio-5C2D91?logo=visualstudio&logoColor=fff&style=for-the-badge
[badge-mysql]: https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=fff&style=for-the-badge
[badge-swagger]: https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=000&style=for-the-badge
[badge-react]: https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB&style=for-the-badge
[badge-javascript]: https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000&style=for-the-badge
[badge-tailwind]: https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=fff&style=for-the-badge
[badge-vscode]: https://img.shields.io/badge/VS%20Code-007ACC?logo=visualstudiocode&logoColor=fff&style=for-the-badge
