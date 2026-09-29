O que é assíncrono e por que a API é assim?
Assíncrono significa que duas coisas acontecem ao mesmo tempo, sem que uma precise esperar a outra terminar para começar.
Buscar dados de uma API é assíncrono porque o seu aplicativo não tem controle sobre o tempo dos outros. O servidor da API pode estar super lento, a internet da pessoa pode estar instável ou o sinal caindo. Se o aplicativo fosse síncrono (uma coisa de cada vez), a tela inteira congelaria e nenhum botão funcionaria até que esses dados chegassem.
O que é uma Promise e seus estados?
Uma Promise é a certeza de que uma resposta vai voltar, seja ela boa ou ruim. Enquanto essa resposta não chega, ela passa por três fases:
• Pending: A resposta ainda está viajando pela internet, você está no aguardo.
• Fulfilled: Deu certo! Os dados chegaram e estão prontos.
• Rejected: Deu errado. A conexão caiu, a página sumiu ou o servidor caiu.
Para que servem async e await?
Eles servem para organizar o fluxo das ações de um jeito que faça sentido para quem está lendo.
• O async avisa que aquela parte do sistema lida com esperas.
• O await diz exatamente em qual linha o sistema deve dar uma pausa para receber a resposta antes de avançar.
O que acontece na espera? Apenas aquela ação específica fica congelada aguardando o dado chegar. O resto do aplicativo continua totalmente livre, rodando liso e respondendo aos seus comandos.
Fetch vs resposta.json()
Essa é a divisão de duas etapas necessárias para conseguir uma informação da internet:
• fetch(url): É o ato de ir buscar a informação na web. O resultado disso é apenas o aviso de que o canal de comunicação foi aberto com sucesso e o pacote chegou.
• resposta.json(): É o ato de ler e traduzir o conteúdo que veio dentro desse pacote, transformando um amontoado de texto bruto em informações que o sistema realmente entende.
Como tratar erros?
Para evitar que o aplicativo simplesmente feche ou quebre quando algo dá errado, o sistema divide as ações em duas zonas de segurança: uma área onde ele tenta realizar a operação demorada e outra área reserva que só é ativada se a primeira falhar. Se a internet sumir no meio do caminho, o sistema desvia o fluxo na hora para essa área reserva, exibindo um aviso amigável na tela em vez de travar tudo.
