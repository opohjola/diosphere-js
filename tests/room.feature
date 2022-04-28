Feature: Room

  Background:
    Given I have empty place for room
    And I initiate room

  Scenario: Initiate room
    Then room.json does exists
    And room.json has no clients
    And diograph.json does exists
    # And diograph.json has one diory
    # And images folder exists
    # And images folder has no files

  Scenario: Delete room
    When I delete room
    Then room.json not exists
    And diograph.json not exists
    # And images folder not exists

  Scenario: Add client to room
    When I add client to room
    Then room.json has 1 client

  Scenario: Content source contents list
    When I add client to room
    And I call listClientContents operation
    Then Content source diograph.json has 4 diories
    # And images folder is not empty in application support room

  Scenario: Content source contents list 2
    When I add client to room
    And I call listClientContents2 operation
    Then Content source diograph.json has 2 diories
    # And images folder is not empty in application support room

  Scenario: Content source contents list for both
    When I add client to room
    And I call listClientContents operation
    And I call listClientContents2 operation
    Then Content source diograph.json has 6 diories
    # And images folder is not empty in application support room

  # Scenario: Add diory from content source
  #   When I initiate room
  #   And I add client to room
  #   Then I can call import operation for client
  #   Then diograph.json has two diories
  #   And images folder has one image
