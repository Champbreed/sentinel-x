package api.authz

default allow = false

# Rule: Allow access if the user's ID matches the resource ID
allow {
    input.user_id == input.resource_id
}

# Rule: Administrative bypass (for demo purposes)
allow {
    input.role == "admin"
}


