# Video Encoder

Esta aplicação realiza a conversão de um formato não suportado para ser exibido pelos navegadores, por estarem fora do padrão do HTML5, para um formato que seja compatível.

É possível acessar esta aplicação em funcionamento neste link da AWS: http://ec2-18-188-43-34.us-east-2.compute.amazonaws.com.

O procedimento é simples, você seleciona o vídeo a ser codificado e clica em Enviar Vídeo. Depois basta esperar a codificação finalizar para poder executar o vídeo que agora é compatível com o seu navegador.

Para executar localmente esta aplicação é necessário a instalação prévia do **Meteor**, do **NodeJS** e do **MongoDB**.

Para realizar o deploy é preciso executar os seguintes comandos:

 **_`meteor build /Pasta/De/Destino`_**
 
 **_`cd /Pasta/De/Destino`_**
 
 **_`tar -zxf videoEncoder.tar.gz`_**
 
 **_`cd bundle/programs/server/`_**
 
 **_`npm install`_**
 
 **_`cd ../..`_**
 
 **_`PORT="PortaAEscolha" MONGO_URL=mongodb://localhost:27017/videoEncoder ROOT_URL=http://localhost node main.js`_**
 
 
 Para executar o codigo para desenvolvimento basta acessar a pasta do projeto e executar o comando:
 
 **_`meteor`_**
 
 
 Na primeira execução pode ser necessário que os seguintes comandos sejam realizados:
 
 
 **_`meteor install`_**
 
 **_`meteor npm install`_**
