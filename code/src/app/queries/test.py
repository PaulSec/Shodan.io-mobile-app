import json
data = """after
Only show results that were collected after the given date (dd/mm/yyyy).
asn
The Autonomous System Number that identifies the network the device is on.
before
Only show results that were collected before the given date (dd/mm/yyyy.
city
Show results that are located in the given city.
country
Show results that are located within the given country.
geo
There are 2 modes to the geo filter: radius and bounding box. To limit results based on a radius around a pair of latitude/ longitude, provide 3 parameters; ex: geo:50,50,100. If you want to find all results within a bounding box, supply the top left and bottom right coordinates for the region; ex: geo:10,10,50,50.
hash
Hash of the "data" property
has_ipv6
If "true" only show results that were discovered on IPv6.
has_screenshot
If "true" only show results that have a screenshot available.
hostname
Search for hosts that contain the given value in their hostname.
isp
Find devices based on the upstream owner of the IP netblock.
link
Find devices depending on their connection to the Internet.
net
Search by netblock using CIDR notation; ex: net:69.84.207.0/24
org
Find devices based on the owner of the IP netblock.
os
Filter results based on the operating system of the device.
port
Find devices based on the services/ ports that are publicly exposed on the Internet.
postal
Search by postal code.
product
Filter using the name of the software/ product; ex: product:Apache
state
Search for devices based on the state/ region they are located in.
version
Filter the results to include only products of the given version; ex: product:apache version:1.3.37
bitcoin.ip
Find Bitcoin servers that had the given IP in their list of peers.
bitcoin.ip_count
Find Bitcoin servers that return the given number of IPs in the list of peers.
bitcoin.port
Find Bitcoin servers that had IPs with the given port in their list of peers.
bitcoin.version
Filter results based on the Bitcoin protocol version.
http.component
Name of web technology used on the website
http.component_category
Category of web components used on the website
http.html
Search the HTML of the website for the given value.
http.html_hash
Hash of the website HTML
http.status
Response status code
http.title
Search the title of the website
ntp.ip
Find NTP servers that had the given IP in their monlist.
ntp.ip_count
Find NTP servers that return the given number of IPs in the initial monlist response.
ntp.more
Whether or not more IPs were available for the given NTP server.
ntp.port
Find NTP servers that had IPs with the given port in their monlist.
ssl
Search all SSL data
ssl.alpn
Application layer protocols such as HTTP/2 ("h2")
ssl.chain_count
Number of certificates in the chain
ssl.version
Possible values: SSLv2, SSLv3, TLSv1, TLSv1.1, TLSv1.2
ssl.cert.alg
Certificate algorithm
ssl.cert.expired
Whether the SSL certificate is expired or not; True/ False
ssl.cert.extension
Names of extensions in the certificate
ssl.cert.serial
Serial number as an integer or hexadecimal string
ssl.cert.pubkey.bits
Number of bits in the public key
ssl.cert.pubkey.type
Public key type
ssl.cipher.version
SSL version of the preferred cipher
ssl.cipher.bits
Number of bits in the preferred cipher
ssl.cipher.name
Name of the preferred cipher
telnet.option
Search all the options
telnet.do
The server requests the client to support these options
telnet.dont
The server requests the client to not support these options
telnet.will
The server supports these options
telnet.wont
The server doesnt support these options"""

data = data.split('\n')
B, C = data[::2], data[1::2]
print(len(B))
print(len(C))

res = []
for index, elem in enumerate(B):
    fil = {
        'filter': elem,
        'description': C[index]
    }
    res.append(fil)

print(json.dumps(res))