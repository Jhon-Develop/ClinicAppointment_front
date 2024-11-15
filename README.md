# <div align="center">CordiSimpleRiwi
</div>

<div align="center"><img src="https://live.mrf.io/statics/i/ps/www.muylinux.com/wp-content/uploads/2017/08/NET.png?width=1200&enable=upscale" alt="Image Description" width="300"></div>

<p align="justify">This project is made in order to better serve people and to provide a higher quality of care and improve the efficiency and way of working of our employees and doctors by improving the quality of technologies.</p>

## Technologies Used

- **C#:** PHP framework for building modern web applications.
- **MySQL:** Database management system for storing users, reservations and events.
- **Jwt:** Jwt is a token based authentication system that is used to authenticate users.

## How to Use

1. **Clone the repository:**
```bash
git clone https://github.com/Jhon-Develop/CordiSimple.git
```
Clone the repository, preferably using the SSH security key or you can also use the HTTPS method.
<p align="center"><img src="https://happygitwithr.com/img/github-https-or-ssh-url-annotated.png" width="600" alt="example-clone-repository"></p>

2. **Navigate to the Project Directory:**
```bash
cd CordiSimple
```
3. **Switch to Your Working Branch:**
```bash
git checkout -b yourBranchName
```
4. **If necessary, Fetch the Latest Changes:**
```bash
git pull origin develop
```
5. **Install Project Dependencies:**
```bash
composer install
npm install
```
6. **Set up the environment file:**
```bash
cp .env.example .env
```
7. **Generate the application key:**
```bash
php artisan key:generate
```
8. **Set up the database and run migrations:**
```bash
php artisan migrate
```
9. **If you want you can load the seed data:**
```bash
php artisan db:seed
```
10. **Run the development server and build the frontend:**
```bash
composer run dev
```

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).