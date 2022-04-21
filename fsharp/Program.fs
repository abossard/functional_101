type Request = string
type Command = { Name: string; Body: Request }
type SQL = string

let requestToCommand request =
    // split string
    let name = request.ToString().Split("/")[1]
    { Name = name; Body = request }

let commandToSqlWith operation command = $"{operation} * from %s{command.Name}"

let validateCommand command =
    match command.Name with
    | null -> Error "No name found."
    | "" -> Error "Name is empty."
    | "bananas" -> Error "Bananas is not a name."
    | _ -> Ok command

let result =
    "GET /bananas/index.html"
    |> requestToCommand
    |> Ok
    |> Result.bind validateCommand
    |> function
        | Ok command -> command
        | _ ->
            { Name = "Unsupported"
              Body = "Unsupported command." }
    |> commandToSqlWith "select"

printfn $"Command is: %A{result}"
