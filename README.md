
## Badges

[//]: # ([![MIT License]&#40;https://img.shields.io/apm/l/atomic-design-ui.svg?&#41;]&#40;https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs&#41;)

[//]: # ([![CodeFactor]&#40;https://www.codefactor.io/repository/github/l-clem/bidgames/badge&#41;]&#40;https://www.codefactor.io/repository/github/l-clem/bidgames&#41;)
![GitHub repo size](https://img.shields.io/github/repo-size/MSPR-Dev-Appli-IA/api)
![Maintenance](https://img.shields.io/maintenance/yes/2023)
# About us

The school project "A'rosa-je" helps individuals to take care of their plants. Founded in 1984, it started with a small team of botanists in one city and now has more than 1500 botanists throughout France who serve plant owners in two ways:

- By going to look after their plants when the owners are away
- By providing maintenance advice so that owners can take better care of their plants.

As a result of the pandemic, she is experiencing a sharp increase in demand that she does not have the capacity to meet. In order to do so, they needed to develop a community and automatic option.

The company therefore called on a design and marketing team that proposed to make an application allowing users to keep their plants with a photo sharing and advice.

In the application only botanists will be able to give advice. The company also wants to set up an A.I. to be able to recognize the plants and give some adapted advices beforehand.


## Tech Stack

**Server:** Express


## Features

- A full featured API with authentification by JWT tokens.

Cf. [Release section](https://github.com/MSPR-Dev-Appli-IA/api/releases)

### Environment Variables

To run this project, you will need to add the following environment variables into your tomcat service

| Name             | Type   | Description                                                                                                                 |
|------------------|--------|-----------------------------------------------------------------------------------------------------------------------------|
| JWTKEY           | string | JWT Secrets                                                                                                                 |
| DATABASE_URL     | string | Mongo URL                                                                                                                   |
| PORT             | string | Express Port                                                                                                                |
| NODE_ENV         | string | Express Environment (test/production)                                                                                       |
| API_HOSTNAME     | string | API Hostname                                                                                                                |
| API_VERSION      | string | API version                                                                                                                 |
| MAP_KEY          | string | ArcGIS API KEY [More Information](https://developers.arcgis.com/documentation/mapping-apis-and-services/security/api-keys/) |
| DEFAULT_BOTANIST | string | Default Botanist Account                                                                                                    |


## FAQ

#### Where's the API documentation ?

The API documentation is available on the *Swagger API* page of the application.

Now you can go on your browser and type :
- https://docs.arosaje.locascio.fr/{version} to get to the API documentation.

#### What's the E/R diagram of your database ?

Here's our E/R diagram (made with [dbdiagram.io](https://dbdiagram.io/home)) :
![](https://i.ibb.co/TRtg1RP/image.png)


## Run Locally
*❗ You can't run this project without the keys needed for authentification*

### Clone the project

```bash
  git clone https://github.com/MSPR-Dev-Appli-IA/api.git
```

Go to the project directory

```bash
  cd api
```

### Install dependencies 

```bash
  npm ci
```

Then start a terminal for each commands

```bash
  npm run start
```

Now you can go on your browser and type :
- https://docs.arosaje.locascio.fr/{version} to get to the API documentation.
- http://localhost:8000/api/auth/login to get to the application website.

## Authors
- [@Ali3597](https://github.com/Ali3597)
- [@ClemLcs](https://github.com/ClemLcs)

