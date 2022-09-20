##### style.kekss

```
  $y = 5;
  $b = 6;
  $col-z = berry;

  @t {
    border: 0px;
    border-radius: 5px;
    background-color: red;
    padding: 10px 20px;
  }


  html {
    background: $col-z;
  }

  button {
    @t;
  }

  .add {
    color: white;
    background-color: rgb($y, 4, $b);
  }
```

##### style.css

```
  :root {
    --y: 5;
    --b: 6;
    --col-z: berry;
  }

  html {
    background: var(--col-z);
  }

  button {
    border: 0px;
    border-radius: 5px;
    background-color: red;
    padding: 10px 20px;
  }

  .add {
    color: white;
    background-color: rgb (var(--y), 4, var(--b));
  }
```
