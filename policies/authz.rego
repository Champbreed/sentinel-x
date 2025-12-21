package api.authz

default allow = false

# Rule: Allow access if the user's ID matches the resource ID
allow if {
    input.user_id == input.resource_id
}

# Rule: Administrative bypass (for demo purposes)
allow if {
    input.role == "admin"
}


