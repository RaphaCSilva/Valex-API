<h1> Valex </h1>
<h2> Rota POST /card/create </h2>

Rota de criação de um cartão novo.

Essa rota é autenticada e espera receber um header http do tipo "x-api-key".

Ja o body deve ser no formato:

```
{ 
  "employeeId": 3213, //number representando o id do funcionario
  "type": "restaurants" //string, sendo um dentre os tipos ("groceries", "restaurants", "transport", "education", "health")
}
```

<h2> Rota PATCH /card/activate/:id </h2>

Rota de ativação do cartão

Deve receber o id do cartão desejado como parametro

O body segue o formato:
```
{
  "securityCode": "324", //string representando o cvc do cartão 
  "password": "4235" //string representando a nova senha, necessariamente 4 numeros
}
```

<h2> Rota GET /card/transactions/:id </h2>

Rota que devolve o extrato do cartão

Deve receber o id do cartão desejado como parametro

O body segue formato:

```
"balance": 35000,    //saldo atual
  "transactions": [   //array contendo um objeto para cada transação, com todas as especificações
		{ 
      "id": 1, 
      "cardId": 1, 
      "businessId": 1, 
      "businessName": "DrivenEats", 
      "timestamp": "22/01/2022", 
      "amount": 5000 
      }
]
  "recharges": [ //array contendo um objeto para cada depósito, com todas as especificações
		{ 
      "id": 1, 
      "cardId": 1, 
      "timestamp": "21/01/2022", 
      "amount": 40000 
     }
]
```

<h2> Rota PATCH /card/lock/:id </h2>

Rota que bloqueia um cartão

Deve receber o id do cartão desejado como parametro, o cartão precisa estar desbloqueado

O body segue o formato:
```
{
  "password": "4235" //string representando a senha do cartão que sera bloqueado, necessariamente 4 numeros
}
```

<h2> Rota PATCH /card/unlock/:id </h2>

Rota que desbloqueia um cartão

Deve receber o id do cartão desejado como parametro, o cartão precisa estar bloqueado 

O body segue o formato:
```
{
  "password": "4235" //string representando a senha do cartão que sera desbloqueado, necessariamente 4 numeros
}
```

<h2> Rota /recharge/:id </h2>

Essa rota deve recarregar o cartão para os funcionários.

Essa rota é autenticada e espera receber um header http do tipo "x-api-key".

O Body segue o formato:
```
{
  "amount": 3500 //number que representa quanto sera depositado
}
```

<h2> Rota /payment/:cardId </h2>

Essa rota serve para realizar pagamentos

O Body segue o formato:
```
{
  "amount": 3500, //number que representa quanto sera gasto
  "password": "4231" // string que representa a senha do cartão a ser usado
  "businessId": 213 // number que representa o id do local que recebera o valor, o tipo deve ser igual ao tipo do cartão
}
```
