# Guia de Implantação do Rapid Support Center

Este guia fornece instruções para implantar o Rapid Support Center em uma VPS usando Docker.

## Requisitos

- VPS com Ubuntu 20.04 ou superior
- Docker e Docker Compose instalados
- Acesso SSH à VPS
- Domínio (opcional, para HTTPS)

## Instalação do Docker e Docker Compose

Se Docker e Docker Compose ainda não estiverem instalados na sua VPS, siga estas etapas:

```bash
# Atualizar pacotes
sudo apt update
sudo apt upgrade -y

# Instalar dependências
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Adicionar chave GPG do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Adicionar repositório do Docker
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Atualizar pacotes e instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Adicionar seu usuário ao grupo docker (para executar Docker sem sudo)
sudo usermod -aG docker $USER
```

Faça logout e login novamente para que as alterações de grupo tenham efeito.

## Implantação da Aplicação

1. Clone o repositório ou faça upload dos arquivos para a VPS:

```bash
git clone <URL_DO_REPOSITÓRIO> rapid-support-center
cd rapid-support-center
```

2. Execute o script de implantação:

```bash
./deploy.sh
```

3. A aplicação estará disponível em `http://seu-ip-da-vps`.

## Configuração de HTTPS (Opcional)

Para configurar HTTPS com Let's Encrypt:

1. Certifique-se de que seu domínio está apontando para o IP da VPS.

2. Descomente as linhas relacionadas ao Certbot no arquivo `docker-compose.yml`.

3. Substitua `your-email@example.com` e `yourdomain.com` pelos seus dados reais.

4. Execute o deploy novamente:

```bash
./deploy.sh
```

5. Configure o Nginx para usar os certificados SSL:

```bash
# Edite o arquivo nginx.conf
nano nginx.conf
```

Adicione a configuração SSL:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Resto da configuração...
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Outras configurações...
}
```

6. Reconstrua e reinicie os contêineres:

```bash
docker-compose down
docker-compose up -d
```

## Manutenção

### Atualização da Aplicação

Para atualizar a aplicação:

1. Faça pull das alterações mais recentes (se estiver usando Git):

```bash
git pull
```

2. Execute o script de implantação novamente:

```bash
./deploy.sh
```

### Visualização de Logs

Para visualizar os logs da aplicação:

```bash
docker-compose logs -f
```

### Backup

Para fazer backup dos dados da aplicação (se aplicável):

```bash
# Criar um diretório para backups
mkdir -p backups

# Backup da aplicação
tar -czvf backups/app-backup-$(date +%Y%m%d).tar.gz ./dist

# Se estiver usando certificados SSL
tar -czvf backups/ssl-backup-$(date +%Y%m%d).tar.gz ./certbot
```

## Solução de Problemas

### A aplicação não está acessível

1. Verifique se os contêineres estão em execução:

```bash
docker-compose ps
```

2. Verifique os logs:

```bash
docker-compose logs
```

3. Verifique se a porta 80 está aberta no firewall:

```bash
sudo ufw status
```

Se necessário, abra a porta:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp  # Se estiver usando HTTPS
```

### Problemas com certificados SSL

Se encontrar problemas com os certificados SSL:

```bash
# Verifique os logs do Certbot
docker-compose logs certbot
```

## Contato e Suporte

Para obter suporte adicional, entre em contato com a equipe de desenvolvimento.
